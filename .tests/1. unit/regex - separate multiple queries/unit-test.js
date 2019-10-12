const bq = '\\'

const valid_strings = [
    `''`                                                                                                      // ''
  , `""`                                                                                                      // ""
  , `'foo bar baz ; hello world'`                                                                             // 'foo bar baz ; hello world'
  , `"foo bar baz ; hello world"`                                                                             // "foo bar baz ; hello world"
  , `'foo "bar" baz ; "hello" world'`                                                                         // 'foo "bar" baz ; "hello" world'
  , `"foo 'bar' baz ; 'hello' world"`                                                                         // "foo 'bar' baz ; 'hello' world"
  , `'foo ''bar'' baz ; ''hello'' world'`                                                                     // 'foo ''bar'' baz ; ''hello'' world'
  , `"foo ""bar"" baz ; ""hello"" world"`                                                                     // "foo ""bar"" baz ; ""hello"" world"
  , `'foo ${bq}'bar${bq}' baz ; ${bq}'hello${bq}' world'`                                                     // 'foo \'bar\' baz ; \'hello\' world'
  , `"foo ${bq}"bar${bq}" baz ; ${bq}"hello${bq}" world"`                                                     // "foo \"bar\" baz ; \"hello\" world"
  , `'foo ${bq}${bq}${bq}'bar${bq}${bq}${bq}' baz ; ${bq}${bq}${bq}'hello${bq}${bq}${bq}' world'`             // 'foo \\\'bar\\\' baz ; \\\'hello\\\' world'
  , `"foo ${bq}${bq}${bq}"bar${bq}${bq}${bq}" baz ; ${bq}${bq}${bq}"hello${bq}${bq}${bq}" world"`             // "foo \\\"bar\\\" baz ; \\\"hello\\\" world"
]

const repeat_count = 3

const valid_queries = valid_strings.map(str => `SELECT ${str} as ENCRYPT_001;`)

const regex_patterns = [
    /\s*;\s*(?=([^']*'[^']*')*[^']*$)/g                                                                       // #1: stackoverflow
  , /\s*;\s*(?=(?:[^']*'[^']*')*[^']*$)/g                                                                     // #2: #1 => remove unnecessary capture groups
  , /\s*;\s*(?=(?:[^']*'[^']*'|[^"]*"[^"]*")*[^'"]*$)/g                                                       // #3: #2 => support strings delimited by double quotes => success
]

const get_inner_queries = (query, regex) => {
//  const result = query.split(regex).map(iq => iq.trim()).filter(iq => iq.length)

  let result
  result = query.split(regex)
  result = result.map(iq => iq ? iq.trim() : '')
  result = result.filter(iq => iq.length)

  return result
}

const is_match = (str, query, regex) => {
  query = query.repeat(repeat_count)

  const inner_queries = get_inner_queries(query, regex)

  if (inner_queries.length !== repeat_count) return false
  if (inner_queries[0] !== inner_queries[1]) return false
  if (inner_queries[1] !== inner_queries[2]) return false
  return true
}

const run_test = (regex) => {
  const not_correct = []

  for (let i=0; i < valid_strings.length; i++) {
    const str   = valid_strings[i]
    const query = valid_queries[i]
    const match = is_match(str, query, regex)

    if (!match)
      not_correct.push(query)
  }

  console.log('='.repeat(60))
  console.log(`RegExp(${ JSON.stringify(regex.source) }, "g")`, "\n")

  if (not_correct.length)
    console.log('[FAIL]', 'The following queries contain valid string literals that were not correctly parsed by the regular expression:', "\n ", not_correct.join("\n  "))
  else
    console.log('[PASS]')

  console.log('')
}

regex_patterns.forEach(regex => {
  run_test(regex)
})
