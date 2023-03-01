#!/bin/bash

RENDERER_DIR="$(dirname -- $(realpath "$BASH_SOURCE";))"
ROOT="$(dirname $RENDERER_DIR)"

# pass through args so we can specify things like --target web --debug
cd $RENDERER_DIR
wasm-pack build $@
if [ "$?" == 0 ]; then
  rm -rf "$ROOT/vendor/renderer"
  cp -r "$RENDERER_DIR/pkg" "$ROOT/vendor/renderer"
  rm "$ROOT/vendor/renderer/.gitignore"
  echo "rebuilt renderer package at vendor/renderer"
fi
