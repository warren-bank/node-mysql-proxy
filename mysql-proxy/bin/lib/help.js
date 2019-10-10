const help = `
usage:
======

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
`

module.exports = help
