@echo off

set proxy_js="%~dp0..\..\..\..\mysql-proxy\bin\mysql-proxy.js"

set logs_dir="%~dp0.\.data\logs"
if not exist %logs_dir% mkdir %logs_dir%

set key_file="%~dp0.\.data\secret.txt"
echo hello world>%key_file%

set proxy_opts=
set proxy_opts=%proxy_opts% --verbose
set proxy_opts=%proxy_opts% --proxy-port     "33306"
set proxy_opts=%proxy_opts% --proxy-protocol "mysql"
set proxy_opts=%proxy_opts% --db-host        "localhost"
set proxy_opts=%proxy_opts% --db-port        "3306"
set proxy_opts=%proxy_opts% --db-user        "root"
set proxy_opts=%proxy_opts% --db-password    "root"
set proxy_opts=%proxy_opts% --pool           "1"
set proxy_opts=%proxy_opts% --hold-connection
set proxy_opts=%proxy_opts% --logs-dir       %logs_dir%
set proxy_opts=%proxy_opts% --encrypt-fields "ENCRYPT_\d+"
set proxy_opts=%proxy_opts% --encrypt-secret %key_file%

node %proxy_js% %proxy_opts%
