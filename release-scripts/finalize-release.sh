#!/usr/bin/env bash

# This script is meant to be used AFTER you have run `prep-changelog.sh` and the CHANGELOG
# updates for the new version have been reviewed and merged. This script:
#
#   1. Bumps the version in package.json and package-lock.json
#   2. Commits the changes from step 1
#   3. Creates a git tag called "v${NEW_VERSION}"

# Changelog generation is handled in prep-changelog.sh and generate-changelog-entries.sh
# so we skip it here.
./node_modules/.bin/standard-version --skip.changelog "$@"
