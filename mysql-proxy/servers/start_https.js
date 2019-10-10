const fs            = require('fs')
const https         = require('https')
const proxy         = require('../proxy')
const handle_events = require('./lib/http')

/* ===================================================================
 * references:
 * -----------
 * https://aghassi.github.io/ssl-using-express-4/
 * ===================================================================
 */

const ssl_options = {
  key:  fs.readFileSync(`${__dirname}/cert/key.pem`),
  cert: fs.readFileSync(`${__dirname}/cert/cert.pem`),
  passphrase: 'mysql-proxy'
}

const start_server = function({proxy_port, db_host, db_port, db_user, db_password, pool, hold_connection, logs_dir, encrypt_fields, encrypt_secret}) {
  const server = https.createServer(ssl_options)

  server.listen(proxy_port, '0.0.0.0', function (e) {
    if (e) {
      console.log(`ERROR: HTTPS server could not bind to port "${proxy_port}"`)
      process.exit(0)
    }
    else {
      console.log(`HTTPS server is listening on port "${proxy_port}"`)
      const {onQuery, db} = proxy({db_host, db_port, db_user, db_password, pool, hold_connection, logs_dir, encrypt_fields, encrypt_secret})
      handle_events({server, onQuery, db})
    }
  })
}

module.exports = start_server
