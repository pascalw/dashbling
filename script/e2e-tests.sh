#!/usr/bin/env bash
set -e
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

packageVersion() {
  node -e "console.log(require('./packages/$1/package.json').version)"
}

packagePath() {
  echo "file:$SCRIPTPATH/../packages/$1/dashbling-$1-$(packageVersion "$1").tgz"
}

yarn lerna exec npm pack

export DASHBLING_CORE_PACKAGE=$(packagePath "core")
export DASHBLING_BUILD_SUPPORT_PACKAGE=$(packagePath "build-support")
export DASHBLING_CLIENT_PACKAGE=$(packagePath "client")

pushd ./packages/create-dashbling-app/
  yarn install
  yarn test:e2e
popd
