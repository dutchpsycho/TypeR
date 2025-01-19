#!/bin/bash

cat <<EOL > config.ini
[settings]
prefix=! 
token=
operators=userid
EOL

echo "Installing dependencies..."
npm install

echo "Installation complete."