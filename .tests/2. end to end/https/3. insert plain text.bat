@echo off

call "%~dp0.\.etc\path.bat"

set sql_file=%~dpn0.sql
set log_file=%~dp0.\.logs\%~n0.txt

curl.exe --insecure -X POST --data-binary "@%sql_file%" -o "%log_file%" "https://127.0.0.1:8443/"
