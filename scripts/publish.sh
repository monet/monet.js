#!/bin/bash

VERSION=$(cat package.json \
 | grep version \
 | head -1 \
 | awk -F: '{ print $2 }' \
 | sed 's/[",]//g' \
 | tr -d '[[:space:]]')

if [[ $VERSION == *"alpha"* ]]
then
  TAG=alpha
elif [[ $VERSION == *"beta"* ]]
then
  TAG=next
elif [[ $VERSION == *"rc"* ]]
then
  TAG=next
else
  TAG=latest
fi

npm publish --tag "$TAG"
