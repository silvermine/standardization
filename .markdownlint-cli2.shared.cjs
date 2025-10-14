'use strict';

const indentAlignment = require('@silvermine/markdownlint-rule-indent-alignment');

module.exports = {

   customRules: [ indentAlignment ],

   config: require('./.markdownlint.json'),
   gitignore: true,

   globs: [ '**/*.md' ],

   ignores: [
      '**/node_modules',
      '**/CHANGELOG.md',
   ],

};
