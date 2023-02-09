#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

MARKDOWN_TEST_FILES=$(find "${SCRIPT_DIR}/../tests/markdownlint" -type f -name '*.md' | sort)

TEST_DID_FAIL=0
for TEST_FILE in $MARKDOWN_TEST_FILES; do
   OUTPUT=$("${SCRIPT_DIR}/../node_modules/.bin/markdownlint" -c "${SCRIPT_DIR}/../.markdownlint.json" "${TEST_FILE}" 2>&1)
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
