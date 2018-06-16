#!/bin/bash

VERSION=$(cat package.json \
 | grep version \
 | head -1 \
 | awk -F: '{ print $2 }' \
 | sed 's/[",]//g' \
 | tr -d '[[:space:]]')

npm version "$VERSION-$TRAVIS_BUILD_NUMBER"
npm publish --tag nightly
