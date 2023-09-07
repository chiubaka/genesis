#! /usr/bin/env bash

DIR="$(dirname "${BASH_SOURCE[0]}")"
DIR="$(realpath "${DIR}")"

WORKSPACE_SCOPE=chiubaka
WORKSPACE_NAME=preset
WORKSPACE_ROOT=$DIR/..
E2E_WORKSPACE=$WORKSPACE_ROOT/tmp/nx-e2e/$WORKSPACE_NAME
TMP_WORKSPACE=/tmp/$WORKSPACE_NAME
NX_VERSION=$(cat $WORKSPACE_ROOT/packages/nx-plugin/package.json | jq -r '.devDependencies.nx')

rm -rf $E2E_WORKSPACE $TMP_WORKSPACE

nx build nx-plugin --skip-nx-cache

cd $WORKSPACE_ROOT/dist/packages/nx-plugin
npm unpublish -f --registry http://localhost:4873
npm publish --registry http://localhost:4873

cd /tmp

chmod a+x $WORKSPACE_ROOT/node_modules/.bin/create-nx-workspace
npm_config_registry=http://localhost:4873 $WORKSPACE_ROOT/node_modules/.bin/create-nx-workspace $WORKSPACE_NAME --preset=@chiubaka/nx-plugin --nxCloud=false --workspaceName=$WORKSPACE_NAME --workspaceScope=$WORKSPACE_SCOPE --description="Locally deployed preset workspace for testing" --skipGitHub --registry=http://localhost:4873

mv $TMP_WORKSPACE $E2E_WORKSPACE
