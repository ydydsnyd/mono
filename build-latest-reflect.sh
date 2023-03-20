#!/bin/bash

VENDOR="$(pwd)/vendor"
cd ../mono
[[ ! -d node_modules ]] && npm install --prefix ./packages/reflect
npm run build --prefix ./packages/reflect
npm pack --workspace ./packages/reflect --pack-destination $VENDOR
REFLECT_V=$(npm pkg get version --prefix ./packages/reflect | sed 's/"//g')
npm pack --workspace ./packages/reflect-server --pack-destination $VENDOR
REFLECT_SERVER_V=$(npm pkg get version --prefix ./packages/reflect-server | sed 's/"//g')
cd -

echo "updating packages"
echo "@rocicorp/reflect $REFLECT_V"
echo "@rocicorp/reflect-server $REFLECT_SERVER_V"

npm pkg set dependencies.@rocicorp/reflect="./vendor/rocicorp-reflect-$REFLECT_V.tgz"
npm pkg set dependencies.@rocicorp/reflect-server="./vendor/rocicorp-reflect-server-$REFLECT_SERVER_V.tgz"
npm install
