#!/usr/bin/env bash

./node_modules/.bin/standard-version --skip.commit --skip.tag "$@"

# standard-version does not have a command for generating changelog entries without
# modifying package.json and package-lock.json. We don't want to perform a version bump in
# this script; we only want to print the recommended verison number. Therefore, we reset
# package*.json back to its original state here.
git checkout package.json
git checkout package-lock.json
