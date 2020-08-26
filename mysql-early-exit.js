const { promisify } = require('util');
const mysql = require('mysql');
const yargs = require('yargs');

const args = yargs
  .option('process-results', {
    desc: 'Whether or not to process the results stream.',
    type: 'boolean',
    default: false
  })
  .option('mysql-host', {
    alias: 'H',
    desc: 'MySQL host to connect to',
    type: 'string',
    default: 'localhost'
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
    default: 'authors_db'
  })
  .option('mysql-user', {
    alias: 'u',
    desc: 'MySQL user to connect as (password is expected as MYSQL_PASSWORD env var)',
    type: 'string',
    default: 'root'
  })
  .help()
  .strict()
  .parse();

main(
  args.processResults,
  args.mysqlHost,
  args.mysqlPort,
  args.mysqlDb,
  args.mysqlUser,
  process.env.MYSQL_PASSWORD
)
  .catch(err => {
    console.error(err.stack);
    process.exitCode = 1;
  })

async function main (processResults, host, port, db, user, password) {
  console.log('connecting');
  const connection = await connect(host, port, db, user, password);

  console.log('running query');
  const resultsStream =  connection.query('SELECT * FROM authors;').stream();

  let resultsCount = 0;

  if (processResults) {
    resultsStream.on('data', () => { resultsCount += 1 });
    await promisify(resultsStream.on.bind(resultsStream))('end');
  }

  console.log(`processed ${resultsCount} results`);

  console.log('disconnecting');
  await disconnect(connection);

  console.log('Disconnected, THIS IS NEVER SHOWN');
};

async function connect (host, port, db, user, pass) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: host,
      port: port,
      user: user,
      password: pass,
      database: db
    });

    connection.connect((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(connection);
      }
    });
  });
}

function disconnect (connection) {
  return promisify(connection.end.bind(connection))();
}
