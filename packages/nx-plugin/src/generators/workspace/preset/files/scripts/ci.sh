#! /usr/bin/env bash

target="$1"
shift
additional_params="$@"

# Always run all targets on the primary branches
if [ "$CIRCLE_BRANCH" == "master" ] || [ "$CIRCLE_BRANCH" == "main" ]; then
  yarn $target:all $additional_params
else
  yarn $target:affected --base=$NX_BASE --head=$NX_HEAD $additional_params
fi
