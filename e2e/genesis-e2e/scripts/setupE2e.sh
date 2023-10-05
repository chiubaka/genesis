#! /usr/bin/env bash

DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"

WORKSPACE_ROOT=$DIR/../../..

cd $WORKSPACE_ROOT

if [ "$CI" == "true" ] && [ -d "$WORKSPACE_ROOT/tmp/nx-e2e/genesis-e2e" ]; then
  echo "Genesis E2E template workspace has already been generated!"
  exit 0
else
  yarn nx setup-e2e:with-dependencies genesis-e2e
fi
