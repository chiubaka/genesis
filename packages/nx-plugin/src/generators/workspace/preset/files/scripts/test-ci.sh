#! /usr/bin/env bash

if [ $CIRCLE_BRANCH == "master" ]; then
  yarn test:ci:all
else
  yarn test:ci:affected
fi
