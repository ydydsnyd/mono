#!/bin/bash

# Takes the current clipboard and converts paths to animations, using the following rules:
# adds timing of $1
# converts all paths to animate
# converts ids to xlinkHref (for react compat), stripping anything past a dash
# converts d to to
# adds attributeName=d

dur=$1
[[ -z "$dur" ]] && dur=1500

out=$(pbpaste \
  | sed -E "s/<path/<animate dur=\"$dur\" attributeName=\"d\" fill=\"freeze\"/g" \
  | sed -E 's/id="([^-"]+)(-[^"]+)?"/xlinkHref="#\1" /g' \
  | sed -E 's/ d="/to="/'
  | sed -E 's/$/\n'
)
echo $out
