const { promisify } = require('util');
const mysql = require('mysql');
/* eslint-disable no-unused-vars */
const iter = require('streaming-iterables');

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

function runLongQuery (connection) {
  const sql = `
SELECT
  *
FROM
  authors
;
`;

  return connection.query(sql).stream();
}

function disconnect (connection) {
  return promisify(connection.end.bind(connection))();
}

module.exports = async function (host, port, db, user, password) {
  console.log('connecting');
  const connection = await connect(
    host,
    port,
    db,
    user,
    password
  );

  console.log('running query');

  /* eslint-disable no-unused-vars */
  const query = runLongQuery(connection);

  // Uncomment the following line to get the proper output
  // await iter.collect(iter.fromStream(query));

  console.log('disconnecting');
  await disconnect(connection);

  console.log('Disconnected, THIS IS NEVER SHOWN');
};
