#! /usr/bin/env node

const {argv_vals, bootstrap_server} = require('./lib/process_argv')
const enable_debug_logging          = require('../lib/debug').enable

const start_server = require(`../servers/start_${argv_vals['--proxy-protocol'] || 'mysql'}`)

if (argv_vals['--verbose'])
  enable_debug_logging(true)

bootstrap_server(start_server)
