@echo off

set _cd=%cd%
set log_s="%~dpn0.server.log"
set log_c="%~dpn0.client.log"

rem :: ---------------------------------------------------------------
rem :: creat a new temporary work area

set tempdir=%~dp0.\proxy-test

if exist "%tempdir%" rmdir /Q /S "%tempdir%"
mkdir "%tempdir%"
cd /D "%tempdir%"

call npm init -y
call npm install --save mysql2

rem :: ---------------------------------------------------------------
rem :: download proxy example

set PATH=C:\PortableApps\wget\1.19.4;%PATH%

wget --no-check-certificate "https://github.com/sidorares/node-mysql2/raw/master/examples/mysqlproxy.js"

rem :: ---------------------------------------------------------------
rem :: reconfigure remote server in proxy example

set PATH=C:\PortableApps\perl\5.10.1;%PATH%

perl -pi.bak -e "s/database: 'dbname',//; s/host: 'server.example.com',/host: '127.0.0.1',/; s/password: 'secret'/password: 'root'/;" mysqlproxy.js
del mysqlproxy.js.bak

rem :: ---------------------------------------------------------------
rem :: change working directory to leave temporary work area.
rem ::   - proxy server crashes when mysql client disconnects
rem ::     => can be fixed by adding: conn.on('error', (err) => {})
rem ::   - proxy server terminal stays open at a command prompt
rem ::   - if the working directory of this terminal is outside
rem ::     the temporary work area, then the temp directory can be deleted

cd /D "%_cd%"

rem :: ---------------------------------------------------------------
rem :: run proxy example

start "proxy-test" node "%tempdir%\mysqlproxy.js" ^>%log_s% ^2^>^&^1

rem :: ---------------------------------------------------------------
rem :: send queries from client
rem :: [assertion] fails with error: no database selected
rem :: [cause]
rem ::   "use" statement is not sent from client to proxy
rem ::   for some inexplicable reason, client only sends: "select database()"

set PATH=C:\PortableApps\MariaDB\10.4.8\bin;%PATH%

set __sql=SHOW DATABASES; USE test; SELECT database(); SHOW TABLES;

cls
echo %__sql% | mysql --port 3307 --table >%log_c% 2>&1

rem :: ---------------------------------------------------------------
rem :: remove temporary work area

rmdir /Q /S "%tempdir%" >NUL 2>&1

rem :: ---------------------------------------------------------------
