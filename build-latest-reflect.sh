#!/bin/bash

VENDOR="$(pwd)/vendor"
OLD_FILES=$(ls vendor | grep rocicorp-reflect)
cd ../mono
[[ $1 == "pull" ]] && git stash -u && git pull && git stash pop
npm install
echo "Building and packaging reflect"
npm run build --prefix ./packages/reflect -- --debug
npm pack --workspace ./packages/reflect --pack-destination $VENDOR
REFLECT_V=$(npm pkg get version --prefix ./packages/reflect | sed 's/"//g')
echo "Building and packaging reflect-server"
npm run build --prefix ./packages/reflect-server -- --debug
npm pack --workspace ./packages/reflect-server --pack-destination $VENDOR
REFLECT_SERVER_V=$(npm pkg get version --prefix ./packages/reflect-server | sed 's/"//g')
cd -

echo "updating packages"
echo "@rocicorp/reflect $REFLECT_V"
echo "@rocicorp/reflect-server $REFLECT_SERVER_V"

TIMESTAMP=$(date +%s)

REFLECT_TARBALL_PATH="./vendor/rocicorp-reflect-$REFLECT_V-$TIMESTAMP.tgz"
REFLECT_SERVER_TARBALL_PATH="./vendor/rocicorp-reflect-server-$REFLECT_SERVER_V-$TIMESTAMP.tgz"
cp "./vendor/rocicorp-reflect-$REFLECT_V.tgz" $REFLECT_TARBALL_PATH
cp "./vendor/rocicorp-reflect-server-$REFLECT_SERVER_V.tgz" $REFLECT_SERVER_TARBALL_PATH
for file in $OLD_FILES; do
  rm "./vendor/$file"
done

npm add $REFLECT_TARBALL_PATH
npm add $REFLECT_SERVER_TARBALL_PATH
