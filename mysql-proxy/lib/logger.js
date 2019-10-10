const path = require('path')
const fs   = require('fs')

const regexs = {
  read_query:  /^(?:SELECT|SHOW|USE)\b/i,
  write_query: [
    /\bFOR UPDATE\b/i
  ]
}

const is_read_query = (query) => {
  let is_read = regexs.read_query.test(query)

  for (let i=0; (i < regexs.write_query.length) && is_read; i++) {
    is_read = !regexs.write_query[i].test(query)
  }

  return is_read
}

const get_timestamp = () => (new Date()).getTime()

const get_filename = () => {
  const d = new Date()
  const Y = '' +  d.getUTCFullYear()
  const M = '' + (d.getUTCMonth() + 1)
  const D = '' +  d.getUTCDate()

  const YYYYMMDD = `${Y}-${(M.length < 2) ? '0' : ''}${M}-${(D.length < 2) ? '0' : ''}${D}`
  const filename = `${YYYYMMDD}.sql`
  return filename
}

const init = (logs_dir) => {
  const no_op   = () => {}
  const enabled = (logs_dir.length)

  // short-circuit
  if (!enabled) {
    return {
      logQuery: no_op
    }
  }

  const logQuery = (query, is_comment = false, prepend_timestamp = true) => {
    if (!query)
      return

    if (is_read_query(query))
      return

    if (is_comment)
      query = '-- ' + query

    if (prepend_timestamp)
      query = `-- ${get_timestamp()}\n${query}`

    query += "\n"

    try {
      const log_file = path.join(logs_dir, get_filename())

      fs.appendFileSync(log_file, query)
    }
    catch(e){
      console.error(query)
    }
  }

  return {logQuery}
}

module.exports = init
