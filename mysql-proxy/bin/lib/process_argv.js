const fs = require('fs')

const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":            {bool:  true},
  "--version":         {bool:  true},
  "--verbose":         {bool:  true},
  "--proxy-port":      {num:   "int"},
  "--proxy-protocol":  {enum:  ["mysql","http","https"]},
  "--db-host":         {},
  "--db-port":         {num:   "int"},
  "--db-user":         {},
  "--db-password":     {},
  "--pool":            {num:   "int"},
  "--hold-connection": {bool:  true},
  "--logs-dir":        {file:  "path-exists"},
  "--encrypt-fields":  {regex: true},
  "--encrypt-secret":  {file:  "text"}
}

const argv_flag_aliases = {
  "--help":            ["-h"],
  "--version":         ["-V"],
  "--verbose":         ["-v"],
  "--pool":            ["-p"],
  "--hold-connection": ["-hc"]
}

const argv_vals = process_argv(argv_flags, argv_flag_aliases)

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  const data = require('../../../package.json')
  console.log(data.version)
  process.exit(0)
}

const bootstrap_server = function(start_server) {
  start_server({
    proxy_port:        argv_vals["--proxy-port"]       || 33306,
//  proxy_protocol:    argv_vals["--proxy-protocol"]   || 'mysql',
    db_host:           argv_vals["--db-host"]          || 'localhost',
    db_port:           argv_vals["--db-port"]          || 3306,
    db_user:           argv_vals["--db-user"]          || 'root',
    db_password:       argv_vals["--db-password"]      || '',
    pool:              argv_vals["--pool"]             || 10,
    hold_connection:   argv_vals["--hold-connection"]  || false,
    logs_dir:          argv_vals["--logs-dir"]         || fs.realpathSync(`${__dirname}/../../../.data/logs`, {encoding: 'utf8'}),
    encrypt_fields:    argv_vals["--encrypt-fields"]   || /ENCRYPT_\d+/,
    encrypt_secret:    argv_vals["--encrypt-secret"]   || fs.readFileSync(fs.realpathSync(`${__dirname}/../../../.data/secret.txt`, {encoding: 'utf8'}), {encoding: 'utf8'})
  })
}

module.exports = {argv_vals, bootstrap_server}
