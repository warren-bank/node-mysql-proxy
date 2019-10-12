const debug = true

const bq = '\\'

const valid_strings = [
    `''`                                                                                                      // ''
  , `""`                                                                                                      // ""
  , `'foo bar baz @ hello world'`                                                                             // 'foo bar baz @ hello world'
  , `"foo bar baz @ hello world"`                                                                             // "foo bar baz @ hello world"
  , `'foo "bar" baz @ "hello" world'`                                                                         // 'foo "bar" baz @ "hello" world'
  , `"foo 'bar' baz @ 'hello' world"`                                                                         // "foo 'bar' baz @ 'hello' world"
  , `'foo ''bar'' baz @ ''hello'' world'`                                                                     // 'foo ''bar'' baz @ ''hello'' world'
  , `"foo ""bar"" baz @ ""hello"" world"`                                                                     // "foo ""bar"" baz @ ""hello"" world"
  , `'foo ${bq}'bar${bq}' baz @ ${bq}'hello${bq}' world'`                                                     // 'foo \'bar\' baz @ \'hello\' world'
  , `"foo ${bq}"bar${bq}" baz @ ${bq}"hello${bq}" world"`                                                     // "foo \"bar\" baz @ \"hello\" world"
  , `'foo ${bq}${bq}${bq}'bar${bq}${bq}${bq}' baz @ ${bq}${bq}${bq}'hello${bq}${bq}${bq}' world'`             // 'foo \\\'bar\\\' baz @ \\\'hello\\\' world'
  , `"foo ${bq}${bq}${bq}"bar${bq}${bq}${bq}" baz @ ${bq}${bq}${bq}"hello${bq}${bq}${bq}" world"`             // "foo \\\"bar\\\" baz @ \\\"hello\\\" world"
]

const invalid_strings = [
    `'foo 'bar' baz @ 'hello' world'`                                                                         // 'foo 'bar' baz @ 'hello' world'
  , `"foo "bar" baz @ "hello" world"`                                                                         // "foo "bar" baz @ "hello" world"
  , `'foo '''bar''' baz @ '''hello''' world'`                                                                 // 'foo '''bar''' baz @ '''hello''' world'
  , `"foo """bar""" baz @ """hello""" world"`                                                                 // "foo """bar""" baz @ """hello""" world"
  , `'foo ${bq}${bq}'bar${bq}${bq}' baz @ ${bq}${bq}'hello${bq}${bq}' world'`                                 // 'foo \\'bar\\' baz @ \\'hello\\' world'
  , `"foo ${bq}${bq}"bar${bq}${bq}" baz @ ${bq}${bq}"hello${bq}${bq}" world"`                                 // "foo \\"bar\\" baz @ \\"hello\\" world"
]

const   valid_queries = []
const invalid_queries = []

valid_strings.forEach(str => {
  valid_queries.push(`SELECT ${str} as ENCRYPT_001, ${str} as ENCRYPT_002`)
  valid_queries.push(`WHERE ENCRYPT_001 = ${str} AND ENCRYPT_002 = ${str};`)
})

invalid_strings.forEach(str => {
  invalid_queries.push(`SELECT ${str} as ENCRYPT_001, ${str} as ENCRYPT_002`)
  invalid_queries.push(`WHERE ENCRYPT_001 = ${str} AND ENCRYPT_002 = ${str};`)
})

// default "--encrypt-fields" argv value
const encrypt_fields = /ENCRYPT_\d+/
const fields_pattern = encrypt_fields.source

// quoted string literal
const ref = 2
const QSL = `(["'])((?:\\\\\\\\|\\\\\\${ref}|\\${ref}\\${ref}|(?!\\${ref})[^\\\\])*)\\${ref}`

  // ==============================================================
  // SELECT clause
  //   ex: `SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002;`
  // ==============================================================
  // WHERE clause
  //   ex: `WHERE ENCRYPT_001 = "foo" AND ENCRYPT_002 = "bar";`
  // ==============================================================

const regex_patterns = [
  {
      select: new RegExp(`([\\b\\s])${QSL}(\\s*(?:as|AS)\\s*${fields_pattern}(?:[\\b\\s,;]|$))`, 'g')
    , where:  new RegExp(`([\\b\\s]${fields_pattern}\\s*=\\s)${QSL}((?:[\\b\\s;]|$))`, 'g')
  }
]

// stubs
const encrypt_secret = 'X'.repeat(10)
const encrypt = (val, secret) => secret

const encrypt_query = (query, regex) => {
  for (let key in regex) {
    query = query.replace(regex[key], ($match, $1, $2, $3, $4) => {
      return `${$1}${$2}${encrypt($3, encrypt_secret)}${$2}${$4}`
    })
  }
  return query
}

const run_test = (regex) => {
  console.log('='.repeat(60))
  console.log('{', "\n", ' select:', `RegExp(${ JSON.stringify(regex.select.source) }, "g")`, ",\n", ' where: ', `RegExp(${ JSON.stringify(regex.where.source) }, "g")`, "\n}\n")

  const query_should_encrypt_but_didnt = []
  const query_shouldnt_encrypt_but_did = []

  for (let i=0; i < valid_queries.length; i++) {
    const query     = valid_queries[i]
    const encrypted = encrypt_query(query, regex)
    const is_same   = (query === encrypted)

    if (is_same)
      query_should_encrypt_but_didnt.push(query)
    else if (debug)
      console.log(encrypted)
  }

  for (let i=0; i < invalid_queries.length; i++) {
    const query     = invalid_queries[i]
    const encrypted = encrypt_query(query, regex)
    const is_same   = (query === encrypted)

    if (!is_same)
      query_shouldnt_encrypt_but_did.push(query)
  }

  if (debug)
    console.log('')
  if (query_should_encrypt_but_didnt.length)
    console.log('[FAIL]', 'The following queries contain valid string literals that should be encrypted but did not match the regular expression:', "\n ", query_should_encrypt_but_didnt.join("\n  "))
  if (query_shouldnt_encrypt_but_did.length)
    console.log('[FAIL]', 'The following queries contain invalid string literals that should not be encrypted but did match the regular expression:', "\n ", query_shouldnt_encrypt_but_did.join("\n  "))
  if (!query_should_encrypt_but_didnt.length && !query_shouldnt_encrypt_but_did.length)
    console.log('[PASS]')

  console.log('')
}

regex_patterns.forEach(regex => {
  run_test(regex)
})
