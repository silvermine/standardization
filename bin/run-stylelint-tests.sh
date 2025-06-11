#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

TEST_FILES=$(find "${SCRIPT_DIR}/../tests/stylelint" -type f -name '*.scss' | sort)

TEST_DID_FAIL=0

for TEST_FILE in $TEST_FILES; do
   OUTPUT=$("${SCRIPT_DIR}/../node_modules/.bin/stylelint" "${TEST_FILE}" 2>&1)
   EXIT_CODE=$?

   if [[ "${TEST_FILE}" == *.pass.scss ]] && [ "${EXIT_CODE}" -ne 0 ]; then
      echo "ERROR: Expected ${TEST_FILE} to pass linting, but it failed linting with:\n${OUTPUT}"
      TEST_DID_FAIL=1
   elif [[ "${TEST_FILE}" == *.fail.scss ]] && [ "${EXIT_CODE}" -eq 0 ]; then
      echo "ERROR: Expected ${TEST_FILE} to fail linting, but the file passed linting"
      TEST_DID_FAIL=1
   fi
done

NUM_FILES=$(echo "$TEST_FILES" | wc -l | tr -d '[:space:]')

if [ "${TEST_DID_FAIL}" -eq 0 ]; then
   echo "All stylelint tests passed across $NUM_FILES test file(s)."
else
   exit 1
fi
