// define: Promise.seq(promises)
require('./promise')

const {debug} = require('../../lib/debug')

const handle_events = function({server, onQuery, db}) {

  const regex = {
      split_queries: /\s*;\s*(?=(?:[^']*'[^']*'|[^"]*"[^"]*")*[^'"]*$)/g
    , new_lines:     /\s*[\r\n]+\s*/g
  }

  const sendResponse = (res, data) => {
    let headers = {
      "Content-Type":                     "application/json",

      // CORS
      "Access-Control-Allow-Origin":      "*",
      "Access-Control-Allow-Methods":     "*",
      "Access-Control-Allow-Headers":     "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age":           "86400",
    }

    res.writeHead(data.code, headers)
    res.end(JSON.stringify(data, null, 2), 'utf8')
  }

  const processPost = (http_request) => {
    return new Promise((resolve, reject) => {
      let buffers = []
      let bytes = 0
      let data

      http_request.on('data', (buf) => {
        if (!buf || !buf.length) return
        bytes += buf.length

        if (bytes > 1e6) {
          buf     = undefined
          buffers = undefined

          data = {
            code:  413,
            error: "Request Entity Too Large"
          }
          reject(data)
        }
        else {
          buffers.push(buf)
        }
      })

      http_request.on('end', () => {
        if (!buffers.length) {
          data = {
            code:  400,
            error: "Bad Request. No SQL query contained in POST data."
          }
          reject(data)
        }
        else {
          let post_data
          post_data = Buffer.concat(buffers, bytes)
          post_data = post_data.toString('utf8').replace(regex.new_lines, ' ').trim()
          resolve(post_data)
        }
      })
    })
  }

  const processResult = (http_response, db_result) => {
    let filtered_result
    if (Array.isArray(db_result)) {
      filtered_result = db_result.map(result => {
        if (Array.isArray(result)) {
          const [rows, fields] = result
          return rows
        }
        else {
          return result
        }
      })
      if (filtered_result.length === 1) {
        filtered_result = filtered_result[0]
      }
    }
    else {
      filtered_result = db_result
    }

    let data = {
      code:  200,
      error: null,
      data:  filtered_result
    }
    sendResponse(http_response, data)
  }

  server.on('request', (req, res) => {
    if(req.method == 'POST') {
      let db_conn = null

      processPost(req)
      .then((post_data) => {
        return db.getConnection()
        .then((conn) => {
          db_conn = conn
        })
        .catch((err) => {
          db_conn = null
        })
        .then(() => {
          return post_data
        })
      })
      .then((post_data) => {
        // split multiple queries into Array
        let queries  = post_data.split(regex.split_queries).filter(query => !!query).map(query => query + ';')
        let promises = queries.map(query => onQuery(query, db_conn))

        // return Promise that resolves after all the individual database queries have received a result
        return Promise.seq(promises)
      })
      .then((db_result) => {
        processResult(res, db_result)
      })
      .catch((err) => {
        if ((err instanceof Object) && err.code && err.error) {
          let data = {
            code:  err.code,
            error: err.error
          }
          sendResponse(res, data)
        }
        else {
          let data = {
            code:  500,
            error: "Internal Server Error"
          }
          if ((err instanceof Error) && err.message) {
            data.error = err.message
          }
          else if (typeof err === 'string') {
            data.error = err
          }
          sendResponse(res, data)
        }
      })
      .finally(() => {
        try {
          if (db_conn) {
            db.releaseConnection(db_conn)
            db_conn = null
          }

          if (!req.connection.destroyed)
            req.connection.destroy()
        }
        catch(e){}
      })
    }
    else {
      let data = {
        code:  405,
        error: "POST method required. Use POST data to transmit SQL query."
      }
      sendResponse(res, data)
    }
  })

}

module.exports = handle_events
