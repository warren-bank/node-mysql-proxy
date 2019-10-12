const CryptoJS = require('crypto-js')

/* ===================================================================
 * references:
 * -----------
 * https://cryptojs.gitbook.io/docs/
 * https://code.google.com/archive/p/crypto-js/wikis/QuickStartGuide_v3beta.wiki
 * https://www.davidebarranca.com/2012/10/crypto-js-tutorial-cryptography-for-dummies/
   ===================================================================
 */

// ===================================================================
// deterministic: key and iv are entirely determined by "secret"
// notes:
//   - weaker encryption
//   - a unique piece of data will always produce an identical encrypted value
//   - allows encrypted values in database to be filtered
//     in WHERE clause of SELECT statement by equality

const get_static_wordarray = (secret) => {
  let hash = CryptoJS.SHA256(secret)
  hash = CryptoJS.enc.Hex.stringify(hash)
  hash = hash.substr(0,32)
  return CryptoJS.enc.Hex.parse(hash)
}

const encrypt_deterministic = (cleartext, secret) => {
  const wordarray  = get_static_wordarray(secret)  // non-random: key, iv
  const crypted    = CryptoJS.AES.encrypt(cleartext, wordarray, {iv:wordarray})
  const ciphertext = CryptoJS.enc.Base64.stringify(crypted.ciphertext)

  return ciphertext
}

const decrypt_deterministic = (ciphertext, secret) => {
  const wordarray  = get_static_wordarray(secret)  // non-random: key, iv
  const cleartext  = CryptoJS.AES.decrypt(ciphertext, wordarray, {iv:wordarray}).toString(CryptoJS.enc.Utf8)

  return cleartext
}

// ===================================================================
// nondeterministic: key and iv are random

const encrypt_nondeterministic = (cleartext, secret) => {
  return CryptoJS.AES.encrypt(cleartext, secret).toString()
}

const decrypt_nondeterministic = (ciphertext, secret) => {
  return CryptoJS.AES.decrypt(ciphertext, secret).toString(CryptoJS.enc.Utf8)
}

// ===================================================================

const encrypt = encrypt_deterministic
const decrypt = decrypt_deterministic

// ===================================================================

const init = (encrypt_fields, encrypt_secret) => {
  const no_op   = (val) => val
  const enabled = ((encrypt_fields instanceof RegExp) && (encrypt_secret.length))

  // short-circuit
  if (!enabled) {
    return {
      encryptQuery:  no_op,
      decryptResult: no_op
    }
  }

  const fields_pattern = encrypt_fields.source

  // quoted string literal
  const QSL = ((ref) => `(["'])((?:\\\\\\\\|\\\\\\${ref}|\\${ref}\\${ref}|(?!\\${ref})[^\\\\])*)\\${ref}`)(2)

  // ==============================================================
  // SELECT clause
  //   ex: `SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002;`
  // ==============================================================
  // WHERE clause
  //   ex: `WHERE ENCRYPT_001 = "foo" AND ENCRYPT_002 = "bar";`
  // ==============================================================

  const regex = {
      select: new RegExp(`([\\b\\s])${QSL}(\\s*(?:as|AS)\\s*${fields_pattern}(?:[\\b\\s,;]|$))`, 'g')
    , where:  new RegExp(`([\\b\\s]${fields_pattern}\\s*=\\s)${QSL}((?:[\\b\\s;]|$))`, 'g')
  }

  const encryptQuery = (query) => {
    for (let key in regex) {
      query = query.replace(regex[key], ($match, $1, $2, $3, $4) => {
        return `${$1}${$2}${encrypt($3, encrypt_secret)}${$2}${$4}`
      })
    }
    return query
  }

  const decryptResult = (result) => {
    if (Array.isArray(result)) {
      const rows = result[0]

      if (Array.isArray(rows)) {
        let i, row, key

        for (i=0; i < rows.length; i++) {
          row = rows[i]

          if (row instanceof Object) {
            for (key in row) {
              if (encrypt_fields.test(key)) {
                row[key] = decrypt(row[key], encrypt_secret)
              }
            }
          }
        }
      }
    }
  }

  return {encryptQuery, decryptResult}
}

module.exports = init
