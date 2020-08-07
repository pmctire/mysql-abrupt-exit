# Node MySQL Early Exit

Demo of the early exit when calling `connection.end()` with a running query.

## Setup

1. Install dependencies

    ```sh
    yarn
    ```

1. Copy `.env.example` to `.env` and fill in the missing variables.
   (instructions inside)

    ```sh
    cp .env.example .env
    ```

## Running

1. Have a MySQL server available
1. Create an empty database
1. Run the script that's available in the `sql` folder, it'll create a table
   called `authors` with dummy data

1. Run the `early-exit` command

    ```sh
    yarn start early-exit -h {your-mysql-host} -u {your-mysql-user}
    ```

    Replace:

    * `{your-mysql-host}` with what your MySQL server hostname (e.g. `localhost`)
    * `{your-mysql-user}` with whatever is your MySQL user

1. Read the output, notice you never see `Disconnected, THIS IS NEVER SHOWN`
   outputted

1. Go in `lib/commands/early-exit.js` and uncomment `await
   iter.collect(iter.fromStream(query));` (line 58)

1. Repeat the previous steps and see the `Disconnected, THIS IS NEVER SHOWN`
   outputted
