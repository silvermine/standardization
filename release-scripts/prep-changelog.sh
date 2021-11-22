#!/usr/bin/env bash

# This script:
#
#   1. Calculates what the next version should be using your repo's commit history and the
#      Conventional Commits spec: https://www.conventionalcommits.org/en/v1.0.0/
#   2. Creates and checks out a git branch for CHANGELOG changes called
#      "changelog-v${NEW_VERSION}"
#   3. Generates CHANGELOG entries and adds them to CHANGELOG.md
#   4. Commits the changes on the "changelog-v${NEW_VERSION}" branch

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 1. Calcuate the next semantic version
NEW_VERSION=$($SCRIPT_DIR/recommended-bump.sh "$@");

if [ -z "$NEW_VERSION" ]
then
   >&2 echo $'Error creating new version.\n'
   exit 1;
fi

# 2. Checkout a new branch for the changelog updates
echo "Creating a new branch for the CHANGELOG updates: changelog-v$NEW_VERSION"
git checkout -b "changelog-v$NEW_VERSION" || exit 1

# 3. Generate the CHANGELOG entries
echo "Generating CHANGELOG entries for v$NEW_VERSION"
$SCRIPT_DIR/generate-changelog-entries.sh "$@" || exit 1

# 4. Commit the changes
echo "Committing CHANGELOG.md"
git add CHANGELOG.md
git commit -m "chore: Update CHANGELOG for v$NEW_VERSION"
