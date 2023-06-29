'use strict';

module.exports = {

   config: require('./.markdownlint.json'),

   globs: [ '**/*.md' ],

   ignores: [
      'node_modules',
      'CHANGELOG.md',
   ],

};
