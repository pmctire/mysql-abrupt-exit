#!/usr/bin/env node
const yargs = require('yargs');

async function runCommand (command, ...args) {
  try {
    await command(...args);
  } catch (err) {
    console.error(err.stack);
    process.exitCode = 1;
  }
}

yargs
  // TODO: replace this with a real command
  .command({
    command: 'early-exit',
    builder (yargs) {
      yargs
        .option('mysql-host', {
          alias: 'H',
          desc: 'MySQL host to connect to',
          type: 'string'
        })
        .option('mysql-port', {
          alias: 'p',
          desc: 'MySQL port to connect to',
          type: 'number',
          default: 3306
        })
        .option('mysql-db', {
          alias: 'd',
          desc: 'MySQL db to query',
          type: 'string',
          default: 'authors'
        })
        .option('mysql-user', {
          alias: 'u',
          desc: 'MySQL user to connect as (password is expected as MYSQL_PASSWORD env var)',
          type: 'string',
          required: true
        })
      ;
    },
    handler ({ mysqlHost, mysqlPort, mysqlDb, mysqlUser }) {
      runCommand(
        require('./commands/early-exit'),
        mysqlHost, mysqlPort, mysqlDb, mysqlUser, process.env.MYSQL_PASSWORD
      );
    }
  })

  .help()
  .version()
  .strict()
  .demandCommand(1)
  .parse();
