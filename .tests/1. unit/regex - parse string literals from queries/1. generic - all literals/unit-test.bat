@echo off

set log="%~dpn0.log"

node "%~dpn0.js" >%log% 2>&1
