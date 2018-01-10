#!/usr/bin/env bash
set -e ; [[ $TRACE ]] && set -x
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t dashbling-tests)

cleanup() {
  status=$?
  rm -rf "$TMP_DIR"
  rm -rf "$packagePath"
  exit $status
}

packageVersion() {
  node -e "console.log(require('./package.json').version)"
}

packagePath() {
  echo "$SCRIPTPATH/dashbling-create-dashboard-$(packageVersion).tgz"
}

trap "cleanup" INT TERM EXIT

npm pack
packagePath=$(packagePath)

cd "$TMP_DIR"
yarn add "file:$packagePath"

./node_modules/.bin/create-dashboard .
yarn build