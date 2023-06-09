'use strict';

const sharedStandards = require('../../.markdownlint-cli2.shared.cjs');

module.exports = {

   ...sharedStandards,

   // Disable the default globs since ./bin/run-markdownlint-tests.sh supplies the files
   // one at a time.
   globs: [],

};
