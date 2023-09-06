#! /usr/bin/env bash

DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"

WORKSPACE_ROOT=$DIR/..

nx build genesis --skip-nx-cache

cd $WORKSPACE_ROOT/dist/packages/nx-plugin-testing
npm unpublish -f --registry http://localhost:4873
npm publish --registry http://localhost:4873

cd $WORKSPACE_ROOT/dist/packages/nx-plugin
npm unpublish -f --registry http://localhost:4873
npm publish --registry http://localhost:4873

cd $WORKSPACE_ROOT/dist/packages/genesis
npm unpublish -f --registry http://localhost:4873
npm publish --registry http://localhost:4873

npm uninstall --location=global --registry=http://localhost:4873 @chiubaka/genesis
npm install --location=global --registry=http://localhost:4873 @chiubaka/genesis
