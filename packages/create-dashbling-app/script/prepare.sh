#!/usr/bin/env bash
TEMPLATES_DIR=$(pwd)/templates
[ -e "$TEMPLATES_DIR" ] && rm -r "$TEMPLATES_DIR"
mkdir "$TEMPLATES_DIR"

cd ../../example && \
  tar cf - \
    --exclude=node_modules/ \
    --exclude=package.json \
    --exclude=yarn.lock \
    . | (cd "$TEMPLATES_DIR" && tar xvf - )