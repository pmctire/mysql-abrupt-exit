# Node MySQL Early Exit

Demo of the early exit when calling `connection.end()` with a running query.

## Setup

1. Install dependencies

    ```sh
    yarn
    ```

1. Start & setup database with docker-compose

    ```sh
    docker-compose up -d
    docker-compose exec mysql sh -c 'exec mysql -uroot -p"supersecret" < /sql/authors.sql'
    ```

## Problem behavior

```sh
MYSQL_PASSWORD=supersecret node ./mysql-early-exit.js --no-process-results
```

Notice you never see `Disconnected, THIS IS NEVER SHOWN` printed to the console.
The last line of the code prints this message. Somehow it's skipped. It seems
like something is calling `exit(0)` behind the scenes when there are leftover
open streams during a disconnect.

## Expected Behaviour

```sh
MYSQL_PASSWORD=supersecret node ./mysql-early-exit.js --process-results
```

Notice that `Disconnected, THIS IS NEVER SHOWN` was printed to the console. The
only difference here is that the results stream for the query was fully
processed by our code.
