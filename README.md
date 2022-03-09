# Silvermine Standardization Utilities

[![NPM Version](https://img.shields.io/npm/v/@silvermine/standardization.svg)](https://www.npmjs.com/package/@silvermine/standardization)
[![License](https://img.shields.io/github/license/silvermine/standardization.svg)](./LICENSE)
[![Build Status](https://travis-ci.com/silvermine/standardization.svg?branch=master)](https://travis-ci.com/silvermine/standardization)
[![Coverage Status](https://coveralls.io/repos/github/silvermine/standardization/badge.svg?branch=master)](https://coveralls.io/github/silvermine/standardization?branch=master)
[![Dependency Status](https://david-dm.org/silvermine/standardization.svg)](https://david-dm.org/silvermine/standardization)
[![Dev Dependency Status](https://david-dm.org/silvermine/standardization/dev-status.svg)](https://david-dm.org/silvermine/standardization#info=devDependencies&view=table)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


## What?

This repo aggregates many of the standards we use when developing our software, including:

   * Release process standardization
   * Markdown linting
   * SASS linting
   * Commit message linting
   * Editor configuration

Notably, we have extensive JavaScript and TypeScript linting that is _not_ included in
this repo. See [@silvermine/eslint-config][eslintconfig] and
[@silvermine/eslint-plugin][eslintplugin] for those standards. They are not part of this
repo because of specific naming requirements for providing Eslint config and plugins.


## Why?

As a team, we value consistency and automated enforcement of standards. This makes it much
easier for new developers on the team or individual external contributors to be able to
write code that looks and feels like the rest of our codebases. It also plays into our
automation since standardization is important when you're maintaining many dozens of
repos.


## Usage

### SASS Linting

TODO: We removed our sass-lint dependency because it was no longer being updated. We need
to replace it with our internal configuration for grunt-stylelint. See #21


### EditorConfig

[EditorConfig](https://editorconfig.org/) provides a default set of editor configuration values
to use in Silvermine projects.

Symlink the .editorconfig file to the root of your project and use the appropriate extension
for your editor:

`ln -s ./node_modules/@silvermine/standardization/.editorconfig`


### Commitlint

   * Add a file called commitlint.config.js to your project root with the following content:

   ```javascript
   'use strict';

   module.exports = {
      extends: [ '@silvermine/standardization/commitlint.js' ],
   };
   ```

   * Use git log --oneline to find the short hash of the previous commit and take note of it
   * Add the following NPM script to `package.json`:

   `"commitlint": "commitlint --from deadbeef"` (where deadbeef is the short hash from the
   previous step)

   * Configure `.gitlab-ci.yml` or `.travis.yml` to run `npm run commitlint`
     before running `npm test`


### markdownlint

Add the following configuration to your Gruntfile.js, register the task, and add
the `markdownlint` task to the `standards` command:

```javascript
// Inside initConfig...
markdownlint: {
   all: {
      src: [ './path/to/markdown/file.md' ],
      options: {
         config: grunt.file.readJSON('.markdownlint.json'),
      },
   },
},

// Register the task:
grunt.loadNpmTasks('grunt-markdownlint');

// Add the command to `grunt standards`:
grunt.registerTask('standards', [ 'markdownlint' ]);
```

TODO: fill in details and examples here.

## License

This software is released under the MIT license. See [the license file](LICENSE) for more
details.


[eslintconfig]: https://github.com/silvermine/eslint-config-silvermine
[eslintplugin]: https://github.com/silvermine/eslint-plugin-silvermine
