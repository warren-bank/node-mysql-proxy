@echo off

call "%~dp0..\.etc\path.bat"

set sql_file=%~dpn0.sql
set log_file=%~dp0.\.logs\%~n0.txt

mysql.exe --host "127.0.0.1" --port "33306" --table <"%sql_file%" >"%log_file%" 2>&1
