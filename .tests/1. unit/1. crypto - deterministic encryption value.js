const CryptoJS = require('crypto-js')

/* ===================================================================
 * references:
 * -----------
 * https://cryptojs.gitbook.io/docs/
 * https://code.google.com/archive/p/crypto-js/wikis/QuickStartGuide_v3beta.wiki
 * https://www.davidebarranca.com/2012/10/crypto-js-tutorial-cryptography-for-dummies/
   ===================================================================
 */

const get_static_wordarray = (secret) => {
  let hash = CryptoJS.SHA256(secret)
  hash = CryptoJS.enc.Hex.stringify(hash)
  hash = hash.substr(0,32)
  return CryptoJS.enc.Hex.parse(hash)
}

const encrypt = (cleartext, secret) => {
  const wordarray  = get_static_wordarray(secret)  // non-random: key, iv
  const crypted    = CryptoJS.AES.encrypt(cleartext, wordarray, {iv:wordarray})
  const ciphertext = CryptoJS.enc.Base64.stringify(crypted.ciphertext)

  return ciphertext
}

const decrypt = (ciphertext, secret) => {
  const wordarray  = get_static_wordarray(secret)  // non-random: key, iv
  const cleartext  = CryptoJS.AES.decrypt(ciphertext, wordarray, {iv:wordarray}).toString(CryptoJS.enc.Utf8)

  return cleartext
}

const secret = 'hello world'

const cleartext = 'foo bar baz'
const encrypted = encrypt(cleartext, secret)
const decrypted = decrypt(encrypted, secret)

console.log(JSON.stringify({cleartext, encrypted, decrypted}, null, 2))
