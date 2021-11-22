#!/usr/bin/env bash

HAS_PKG_CHANGES=$(git status -s | grep package.*.json)

if [ ! -z "$HAS_PKG_CHANGES" ]
then
   >&2 echo $'\n------------------------------ ERROR ------------------------------'
   >&2 echo $'You have uncommitted changes in package.json or package-lock.json. '
   >&2 echo $'This script will overwrite uncommitted changes to package.json '
   >&2 echo $'and package-lock.json. Commit or stash the changes first, then '
   >&2 echo $'re-run this script.'
   >&2 echo $'-------------------------------------------------------------------\n\n'
   exit 1;
fi

./node_modules/.bin/standard-version --skip.commit --skip.tag --skip.changelog "$@" > /dev/null

NODE_VERSION=$(node -p -e "require('./package.json').version")

# standard-version does not have a command for calculating the recommended version bump
# without modifying package.json and package-lock.json. We don't want to perform a version
# bump in this script; we only want to print the recommended verison number. Therefore, we
# reset package*.json back to its original state here.
git checkout package.json &> /dev/null
git checkout package-lock.json &> /dev/null

echo $NODE_VERSION
