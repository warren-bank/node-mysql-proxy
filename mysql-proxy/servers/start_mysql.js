require('./lib/mysql-monkeypatch')

const mysql         = require('mysql2')
const proxy         = require('../proxy')
const handle_events = require('./lib/mysql')

const start_server = function({proxy_port, db_host, db_port, db_user, db_password, pool, hold_connection, logs_dir, encrypt_fields, encrypt_secret}) {
  const server = mysql.createServer()

  server.listen(proxy_port, '0.0.0.0', function (e) {
    if (e) {
      console.log(`ERROR: MySQL server could not bind to port "${proxy_port}"`)
      process.exit(0)
    }
    else {
      console.log(`MySQL server is listening on port "${proxy_port}"`)
      const {onQuery, db} = proxy({db_host, db_port, db_user, db_password, pool, hold_connection, logs_dir, encrypt_fields, encrypt_secret})
      handle_events({server, onQuery, db})
    }
  })
}

module.exports = start_server
