const {debug} = require('../../lib/debug')

/* ===================================================================
 * references:
 * -----------
 * https://github.com/sidorares/node-mysql2/blob/master/examples/mysqlproxy.js
 * ===================================================================
 */

const processResult = (cl_conn, db_result) => {
  if (!Array.isArray(db_result)) {
    // sanity check: should never occur
    cl_conn.writeEof()
  }
  else {
    const [rows, fields] = db_result

    if (Array.isArray(rows)) {
      cl_conn.writeTextResult(rows, fields)
    }
    else {
      cl_conn.writeOk(rows)
    }
  }
}

const handle_events = function({server, onQuery, db}) {
  let id = 0

  server.on('connection', (cl_conn) => {
    let db_conn = null

    const db_getConnection = () => {
      return (db_conn)
        ? Promise.resolve(db_conn)
        : db.getConnection()
            .then((conn) => {
              db_conn = conn
            })
            .catch((err) => {
              db_conn = null
            })
            .then(() => {
              return db_conn
            })
    }

    cl_conn.serverHandshake({
      protocolVersion: 10,
      serverVersion:   'mysql-proxy',
      connectionId:    id++,
      statusFlags:     2,
      characterSet:    8,
      capabilityFlags: 0xffffff
    })

    cl_conn.on('query', function(query) {
      db_getConnection()
      .then(() => {
        return onQuery(query, db_conn)
      })
      .then((db_result) => {
        processResult(cl_conn, db_result)
      })
      .catch((err) => {
        cl_conn.writeError({code: 1064, message: err.message})
      })
    })

    cl_conn.on('init_db', (schemaName) => {
      cl_conn.emit('query', `USE ${schemaName};`)
    })

    cl_conn.on('field_list', (table, fields) => {
      cl_conn.writeEof()
    })

    cl_conn.on('end', () => {
      if (db_conn) {
        db.releaseConnection(db_conn)
        db_conn = null
      }
    })

    cl_conn.on('error', (err) => {
      if (db_conn) {
        db.releaseConnection(db_conn)
        db_conn = null
      }

      if (err && err.code)
        debug('[ERROR]', `Client connection closed (${err.code})`)
    })
  })
}

module.exports = handle_events
