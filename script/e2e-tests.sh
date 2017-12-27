#!/usr/bin/env bash
set -e

pushd ./packages/build-support/
  yarn build
popd

pushd ./packages/core/
  yarn build
popd

pushd ./packages/create-dashbling-app/
  yarn install
  yarn test
popd
