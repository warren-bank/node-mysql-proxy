@echo off

call "%~dp0.\.etc\path.bat"

mysql.exe --host "127.0.0.1" --port "33306"
