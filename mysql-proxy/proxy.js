const mysql    = require('mysql2')
const crypto   = require('./lib/crypto')
const logger   = require('./lib/logger')
const {debug}  = require('./lib/debug')

const proxy = function({db_host, db_port, db_user, db_password, pool, hold_connection, logs_dir, encrypt_fields, encrypt_secret}) {

  const db = mysql.createPool({
    host:               db_host,
    port:               db_port,
    user:               db_user,
    password:           db_password,
    waitForConnections: true,
    connectionLimit:    pool,
    queueLimit:         0
  })

  const db_getConnection = () => {
    return new Promise((resolve, reject) => {
      if (!hold_connection) {
        resolve(null)
      }
      else {
        db.getConnection(function(err, conn) {
          if (err)
            reject(err)
          else
            resolve(conn)
        })
      }
    })
  }

  const db_releaseConnection = (conn) => {
    if (conn)
      db.releaseConnection(conn)
  }

  const {logQuery} = logger(logs_dir)

  const {encryptQuery, decryptResult} = crypto(encrypt_fields, encrypt_secret)

  const onQuery = (query, conn) => {
    return new Promise((resolve, reject) => {
      // sanity check
      if (!query) {
        reject()
        return
      }

      let encrypted_query = encryptQuery(query)

      if (encrypted_query !== query) {
        logQuery(query,           true,  true)
        logQuery(encrypted_query, false, false)

        query           = encrypted_query
        encrypted_query = undefined
      }
      else {
        logQuery(query, false, true)
        encrypted_query = undefined
      }

      debug('[QUERY]', query)

     ;(conn || db).query(query, function (err, ...result) {
        if (err) {
          debug('[ERROR]', err.message)
          reject(err)
        }
        else {
          decryptResult(result)

          // result is Array when query is SELECT, SHOW, etc
          debug('[RESULT]', result)
          resolve(result)
        }
      })
    })
  }

  return {onQuery, db: {getConnection: db_getConnection, releaseConnection: db_releaseConnection}}
}

module.exports = proxy
