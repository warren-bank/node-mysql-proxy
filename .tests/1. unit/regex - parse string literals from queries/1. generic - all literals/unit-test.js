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

const   valid_queries =   valid_strings.map(str => `SELECT ${str} as ENCRYPT_001`)
const invalid_queries = invalid_strings.map(str => `SELECT ${str} as ENCRYPT_001`)

const regex_patterns = [
    /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g                                                                  // #1: stackoverflow
  , /(["'])((\\{2})*|(.*?(?<!\\)(\\{2})*))\1/g                                                                // #2: #1 => replace character class with negative lookbehind
  , /(["'])((\\{2})*|(.*?[^\\](\\{2})*)|(\1\1)*|(.*?[^\1](\1\1)*))\1/g                                        // #3: #1 => duplicate '\\' patterns for '\1' backreference
  , /(["'])((\\{2})*|(.*?[^\\](\\{2})*)|(\1\1)*|(.*?(?<!\1)(\1\1)*))\1/g                                      // #4: #2 => duplicate '\\' patterns for '\1' backreference
  , /(["'])((?:\\{2})*|(?:.*?[^\\](?:\\{2})*))\1/g                                                            // #5: #1 => remove unnecessary capture groups

  , /(["'])((?:\\\\|\\\1|\1\1|(?!\1)[^\\])*)\1/g                                                              // #6: start over from scratch => success
]

const get_unquoted_strings = (query, regex) => {
  const result = []
  let match

  while (match = regex.exec(query)) {
    let quote_char   = match[1]
    let unquoted_str = match[2]
    result.push({quote_char, unquoted_str})
  }

  return result
}

const is_match = (str, query, regex) => {
  const unquoted_strings = get_unquoted_strings(query, regex)

  if (unquoted_strings.length === 0) return false
  if (unquoted_strings.length !== 1) return false

  const {quote_char, unquoted_str} = unquoted_strings[0]
  const str_parsed = `${quote_char}${unquoted_str}${quote_char}`

  return (str === str_parsed)
}

const run_test = (regex) => {
  const strings_should_match_but_didnt = []
  const strings_shouldnt_match_but_did = []

  for (let i=0; i < valid_strings.length; i++) {
    const str   = valid_strings[i]
    const query = valid_queries[i]
    const match = is_match(str, query, regex)

    if (!match)
      strings_should_match_but_didnt.push(str)
  }

  for (let i=0; i < invalid_strings.length; i++) {
    const str   = invalid_strings[i]
    const query = invalid_queries[i]
    const match = is_match(str, query, regex)

    if (match)
      strings_shouldnt_match_but_did.push(str)
  }

  console.log('='.repeat(60))
  console.log(`RegExp(${ JSON.stringify(regex.source) }, "g")`, "\n")

  if (strings_should_match_but_didnt.length)
    console.log('[FAIL]', 'The following are valid string literals that did not match the regular expression:', "\n ", strings_should_match_but_didnt.join("\n  "))
  if (strings_shouldnt_match_but_did.length)
    console.log('[FAIL]', 'The following are invalid string literals that did match the regular expression:', "\n ", strings_shouldnt_match_but_did.join("\n  "))
  if (!strings_should_match_but_didnt.length && !strings_shouldnt_match_but_did.length)
    console.log('[PASS]')

  console.log('')
}

regex_patterns.forEach(regex => {
  run_test(regex)
})
