'use strict';

const sharedStandards = require('./.markdownlint-cli2.shared.cjs');

module.exports = {

   ...sharedStandards,

   ignores: [
      ...sharedStandards.ignores,

      'tests/**/*.md',
   ],

};
