@echo off
REM make config
echo [settings] > config.ini
echo prefix=! >> config.ini
echo token= >> config.ini
echo operators=userid >> config.ini

REM install node.js 
echo Installing dependencies...
npm install

echo Installation complete.
pause