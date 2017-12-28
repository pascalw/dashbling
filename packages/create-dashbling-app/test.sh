#!/usr/bin/env bash
set -e ; [[ $TRACE ]] && set -x
TMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t dashbling-tests)

cleanup() {
  status=$?
  rm -rf "$TMP_DIR"
  exit $status
}

trap "cleanup" INT TERM EXIT

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
"$SCRIPTPATH/create-dashboard.js" "$TMP_DIR"

cd "$TMP_DIR"
./node_modules/.bin/dashbling compile
