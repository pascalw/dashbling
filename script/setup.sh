#!/bin/sh
echo "Setting up git hooks..."
for h in hooks/*; do ln -sf ../../$h .git/hooks/$(basename $h); done

echo "Installing dependencies..."
yarn install
