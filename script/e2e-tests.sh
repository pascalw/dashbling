#!/usr/bin/env bash
set -e

yarn build

pushd ./packages/create-dashbling-app/
  yarn install
  yarn test
popd
