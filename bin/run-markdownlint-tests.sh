#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

MARKDOWN_TEST_FILES=$(find "${SCRIPT_DIR}/../tests/markdownlint" -type f -name '*.md' | sort)

TEST_DID_FAIL=0

# markdownlint-cli2 config files are merged with other versions of this file in a parent
# directory, up to the current directory. To prevent the test-specific config from being
# merged with the project's general config, we have to `cd` to the test directory.
# Docs: https://github.com/DavidAnson/markdownlint-cli2/tree/main#markdownlint-cli2jsonc
pushd "${SCRIPT_DIR}/../tests/markdownlint" > /dev/null

for TEST_FILE in $MARKDOWN_TEST_FILES; do
   OUTPUT=$("${SCRIPT_DIR}/../node_modules/.bin/markdownlint-cli2-config" "${SCRIPT_DIR}/../tests/markdownlint/.markdownlint-cli2.cjs" "${TEST_FILE}" 2>&1)
   EXIT_CODE=$?

   if [[ "${TEST_FILE}" == *.pass.md ]] && [ "${EXIT_CODE}" -ne 0 ]; then
      echo "ERROR: Expected ${TEST_FILE} to pass linting, but it failed linting with:\n${OUTPUT}"
      TEST_DID_FAIL=1
   elif [[ "${TEST_FILE}" == *.fail.md ]] && [ "${EXIT_CODE}" -eq 0 ]; then
      echo "ERROR: Expected ${TEST_FILE} to fail linting, but the file passed linting"
      TEST_DID_FAIL=1
   fi
done

if [ "${TEST_DID_FAIL}" -eq 0 ]; then
   echo "All markdownlint tests passed."
else
   exit 1
fi
