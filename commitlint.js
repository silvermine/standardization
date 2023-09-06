'use strict';

var VALID_TYPES,
    VALID_PREFIXES;

VALID_TYPES = [
   'build',
   'chore',
   'ci',
   'config',
   'docs',
   'feat',
   'fix',
   'perf',
   'refactor',
   'revert',
   'style',
   'test',
];

VALID_PREFIXES = [
   'Merge',
   'Revert',
];

module.exports = {
   rules: {
      'body-leading-blank': [ 2, 'always' ],
      'body-max-line-length': [ 2, 'always', 90 ],
      'footer-leading-blank': [ 2, 'always' ],
      'footer-max-line-length': [ 2, 'always', 90 ],
      'header-max-length': [ 2, 'always', 72 ],
      'scope-case': [ 2, 'always', [ 'lower-case', 'kebab-case' ] ],
      'scope-enum': [ 2, 'always', VALID_TYPES ],
      'subject-case': [
         2,
         'never',
         [ 'upper-case' ],
      ],
      'subject-empty': [ 2, 'never' ],
      'subject-full-stop': [ 2, 'never', '.' ],
      'type-case': [ 2, 'always', 'lower-case' ],
      'type-empty': [ 2, 'never' ],
      'type-enum': [
         2,
         'always',
         // In addition to the standard types, allow "sub" for commits that support a
         // larger feature, fix, etc.
         VALID_TYPES.concat([ 'sub' ]),
      ],
   },
   // The default ignores of commitlint allow prefixes like fixup! and squash!,
   // which we don't allow. Therefore, we're turning off defaultIgnores and
   // explicitly ignoring only auto-generated merge commit and revert messages
   defaultIgnores: false,
   ignores: [
      (commit) => {
         return VALID_PREFIXES.some((prefix) => {
            return commit.startsWith(prefix);
         });
      },
   ],
};
