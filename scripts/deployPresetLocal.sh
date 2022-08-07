#! /usr/bin/env bash

DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"

WORKSPACE_NAME=proj
WORKSPACE_ROOT=$DIR/..
E2E_WORKSPACE=$WORKSPACE_ROOT/tmp/nx-e2e/$WORKSPACE_NAME
TMP_WORKSPACE=/tmp/$WORKSPACE_NAME

rm -rf $E2E_WORKSPACE $TMP_WORKSPACE

nx build nx-plugin
cd $WORKSPACE_ROOT/dist/packages/nx-plugin
npm unpublish -f --registry http://localhost:4873
npm publish --registry http://localhost:4873

cd /tmp
npm_config_registry=http://localhost:4873 npx create-nx-workspace $WORKSPACE_NAME --preset=@chiubaka/nx-plugin --nxCloud=false

mv $TMP_WORKSPACE $E2E_WORKSPACE
