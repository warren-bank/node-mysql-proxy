### [mysql-proxy](https://github.com/warren-bank/node-mysql-proxy)

An extremely lightweight MySQL proxy server. SQL writes to DB are logged. Supports conditional AES symmetric key encryption of fields.

#### Installation:

```bash
npm install --global @warren-bank/node-mysql-proxy
```

- - - -

#### Usage:

```bash
mysql-proxy <options>

options:
========

"-h"
"--help"
    Print a help message describing all command-line options.

"-V"
"--version"
    Print the version number.

"-v"
"--verbose"
    Prints runtime debug information.
    Examples:
      * queries after encryption
      * results after decryption

"--proxy-port" <port>
    Proxy server port number.
    Default: 33306

"--proxy-protocol" <network-protocol>
    Proxy server network protocol.
    Options: "mysql", "http", "https"
    Default: "mysql"
    Notes:
      * "mysql" proxy server:
        - requires a mysql client or "driver"
          ex: mysql --port 33306
      * "http" and "https" proxy servers:
        - requires a http/s client
          ex: echo -e 'SELECT * FROM db_name.table_name;' | curl -X POST --data-binary @- 'http://localhost:33306/'

"--db-host" <host>
    MySQL server host.
    Default: "localhost"

"--db-port" <port>
    MySQL server port number.
    Default: 3306

"--db-user" <username>
    MySQL server user.
    Default: "root"

"--db-password" <password>
    MySQL server password.
    Default: ""

"-p" <max_connections>
"--pool" <max_connections>
    Maximum number of open MySQL server connections to hold in pool.
    Default: 10

"-hc"
"--hold-connection"
    Modifies connection pool management behavior.
    Default: each individual query obtains a db connection that is immediately released.
    Altered: each HTTP/S request or MySQL client session obtains a single db connection.
             this connection is held for the duration of that session,
             and all queries pass through it.
    Notes:
      * it is more efficient to not enable this option
      * regarding a single HTTP/S request:
        - the POST data can contain several queries
        - the proxy will split them apart (on ';' characters)
        - each query is run individually and sequentially
        - even when a single db connection is not held by the session,
          all individual queries will still be run sequentially

"--logs-dir" </path/to/output/.sql/file/logs>
    Path to directory into which SQL write statements
        will be written to output log files.
    Default: </path/to/node-mysql-proxy/.data/logs>

"--encrypt-fields" <regex>
    Table field names/aliases that match this regular expression
        will have the corresponding value:
          * encrypted before it is sent to MySQL server
          * decrypted after it is retrieved from MySQL server
    Default: "ENCRYPT_\d+"
    Notes:
      * case sensitive

"--encrypt-secret" </path/to/input/secret/file.txt>
    Path to text file that contains the "secret" used by AES
    for symmetric key encryption of field names/aliases that match
    the "--encrypt-fields" regex.
    Default: </path/to/node-mysql-proxy/.data/secret.txt>
    Notes:
      * if "--encrypt-fields" is specified:
        - file must exist
        - file must not be empty
          * for convenience, empty file is provided at default path
      * for best results:
        - the "secret" should be 245 characters long
        - each character is 1-byte ascii in the decimal range: 0-127
```

- - - -

#### Encryption:

__use case__:

* you want to write an app/service that requires a database layer
* you want to use a low-cost shared database
  * or replicate the data across several such low-cost shared databases
* you don't trust the company that hosts the database server(s) to not steal/misuse your data
* you want to encrypt certain fields in the database
  * the data is encrypted before it is sent to the server
  * the data is decrypted after it is retrieved from the server

__how it works__:

* all queries are rewritten as they pass through the proxy, such that:
  * in `SELECT` statements:
    * in each request:
      * fields that are assigned a literal string value are conditionally encrypted when the field is given an alias that matches the `--encrypt-fields` regex
      * values in `WHERE` clauses are conditionally encrypted when the field is given an alias that matches the `--encrypt-fields` regex
    * in each response:
      * values are conditionally decrypted when the field is given an alias that matches the `--encrypt-fields` regex
    * _example_:
      * `SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;`
      * `SELECT field_1 as ENCRYPT_001, field_2 as ENCRYPT_002, field_3 as ENCRYPT_003 FROM table_1;`
      * `SELECT * FROM (SELECT field_1 as ENCRYPT_001, field_2 as ENCRYPT_002, field_3 as ENCRYPT_003 FROM table_1) as crypto WHERE CHAR_LENGTH(ENCRYPT_001) = 24 AND ENCRYPT_001 = "foo";`
  * in `INSERT ... SELECT` statements:
    * _example_:
      * `INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;`
    * written to log file:
      ```SQL
        -- 1570783565067
        -- INSERT into table_1 (field_1, field_2, field_3) SELECT "foo" as ENCRYPT_001, "bar" as ENCRYPT_002, "baz" as ENCRYPT_003;
           INSERT into table_1 (field_1, field_2, field_3) SELECT "rEaqocFLxO2K0V13lweg4Q==" as ENCRYPT_001, "QgLALzZQeE+nSjMfoZkoJQ==" as ENCRYPT_002, "58WZ9otn/F98C4UfZPubrQ==" as ENCRYPT_003;
      ```

__additional thoughts/comments__:

* this proxy does not support the following features:
  * replicate writes to multiple databases
  * manage permissions or access control
* this proxy does not attempt to:
  * pool connections to more than one database server
  * pool connections belonging to more than one user
* this proxy can be combined with other software:
  * _example_:
    * `app` &gt; `mysql-proxy` &gt; `ProxySQL` &gt; multiple "master" databases
  * [ProxySQL](https://github.com/sysown/proxysql)
    * reads are load balanced:
      * one database is chosen at random
    * writes are replicated:
      * all databases are updated
  * access control could either be implemented:
    * at the `app` layer
      * `mysql-proxy` connects to database as `root`
      * `mysql-proxy` can only be accessed by `app`
      * `app` performs user registration and login validation
      * `app` contains business logic that is responsible for reading and writing to database via `mysql-proxy`
    * at the database layer
      * more than one instance of `mysql-proxy` is started
      * each instance:
        * listens on a unique port
        * connects to database as a unique user
      * _example_:
        * one particular instance of the proxy connects to database as a user having very limited read-only permissions
          * the firewall allows this port to be accessed from the outside world
          * client-side javascript can send XHR requests directly to this instance of `mysql-proxy`

- - - -

#### Credits:

* [mysql2](https://github.com/sidorares/node-mysql2) by [Andrey Sidorov](https://github.com/sidorares)
  * does absolutely _all_ of the heavy lifting RE: MySQL
* [CryptoJS](https://github.com/brix/crypto-js)
  * does absolutely _all_ of the heavy lifting RE: AES symmetric key encryption

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
