#!/bin/bash

[[ -z "$1" ]] && echo "first argument must be a secret" && exit 1

ENV="rc"
[[ "$2" == "staging" ]] && ENV="jd"

NODE_PROGRAM="(async () => {\
const s='$1';\
const en=[...s].reduce((ui, _, i) => {\
  ui[i] = s[i].charCodeAt(0);\
  return ui\
}, new Uint8Array(s.length));\
const o=await crypto.subtle.digest('SHA-256', en);\
console.log(new Uint8Array(o).toString())\
})()"
SECRET=$(node -e "$NODE_PROGRAM")

echo "writing hashed value $SECRET"

F=$(mktemp)
function cleanup()
{
  rm $F
}

trap cleanup EXIT

echo "{\"NEW_ROOM_SECRET\": \"$SECRET\"}" > $F

npm run wrangler-$ENV -- secret:bulk $F
