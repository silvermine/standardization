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

Add the following command to your Gruntfile.js, register the grunt-stylelint plugin, and
add the `stylelint` command to the `standards` task:

```javascript
stylelint: {
   options: {
      configFile: './node_modules/@silvermine/standardization/.stylelintrc.yml',
   },
   src: './path/to/scss/source/**/*.scss',
},

// Register grunt-stylelint like so:
grunt.loadNpmTasks('grunt-stylelint');

// Then include the command along with `grunt standards`
grunt.registerTask('standards', [ 'stylelint' ]);
```


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


### Release Process

#### Configuration

   1. Ensure that the project's `package.json` file has a
      [`repository.url`][package-json-repo-url] field with the URL to the canonical repo
      for the project in its git hosting solution, e.g.
      <https://github.com/silvermine/event-emitter.git> for the
      [@silvermine/event-emitter](https://github.com/silvermine/event-emitter) project.
      * This is necessary because conventional-changelog needs to know the URL to the git
         hosting solution so that it can make links to "compare URLs" in the CHANGELOG
   1. Add the following NPM scripts to the project's `package.json` file:

      ```json
      "release:preview": "node ./node_modules/@silvermine/standardization/scripts/release.js preview",
      "release:prep-changelog": "node ./node_modules/@silvermine/standardization/scripts/release.js prep-changelog",
      "release:finalize": "node ./node_modules/@silvermine/standardization/scripts/release.js finalize"
      ```

   1. (Optional) If the project is using an issue tracking system other than what the git
      hosting solution provides (e.g. the code is hosted on GitHub but uses Azure DevOps
      for issue tracking), add this config to the project's `package.json`:

      ```json
      "silvermine-standardization": {
         "changelog": {
            "issueUrlFormat": "https://issuetracker.example.com/tickets/{{id}}"
         }
      }
      ```

[package-json-repo-url]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository

#### Release a New Package Version

At a high-level, the process for releasing a new version of a package is:

   1. Generate the new changelog entries (See [Prepare the
      Changelog](#prepare-the-changelog)
   1. Submit the changelog updates through the standard code review process
   1. Update the version number in `package.json` and create the version tag (See [Perform
      the Version Bump](#perform-the-version-bump))

##### Prepare the Changelog

   1. Checkout and update the branch that is to be released
      * For example, if you are working off of `master`:

         ```bash
         git fetch --all
         git checkout master
         git reset origin/master --hard
         git log -n 5
         ```

   1. Install the NPM dependencies and ensure the tests pass:

      ```bash
      npm ci
      npm run standards && npm test
      ```

   1. Run `npm release:prep-changelog`. You should now be on a branch named
      `changelog-v${NEW_VERSION}` containing the automatically generated changelog
      additions.
      * If you receive the message "There were no changelog entries generated" and this is
        expected, please proceed to [Perform the Version Bump](#perform-the-version-bump).
      * If the changelog needs to be edited, please make the needed adjustments and amend
        your edits to the "chore: update changelog" commit.
      * When preparing the changelog for a final version, the release candidate changelog
        entries will be removed and the changelog will be regenerated for the release.
        Please ensure that any edits made to the release candidate changelog entries are
        reapplied to the final changelog.
   1. Push the branch to the correct remote repo and open a pull request.

##### Perform the Version Bump

   1. Once the changelog has been merged, checkout and update the branch that is to be
      released. The last commit should be the merge commit for the updates to the
      changelog.
   1. Run `npm release:finalize`
   1. Preview the changes and push the branch and `v${NEW_VERSION}` tag to the correct
      remote repo
   1. If the version should be published and this is not handled by a CI/CD pipeline, run
      `npm publish` to publish the package

##### Special Cases

In most cases, `npm release:preview`, `npm release:prep-changelog`, and `npm
release:finalize` will be run without any additional options. However, there are a few
cases when you may need to supply extra options.

###### First Release

When a package is first created, the package.json typically says the version is v0.1.0.
If that's the version you want to generate the changelog for and publish to NPM, there's a
problem. The release script will want to bump the package to v0.2.0 or v0.1.1. As such, a
version of 0.1.0 has to be specified using the `--version` option. For example:

```bash
npm release:preview -- --version 0.1.0
npm release:prep-changelog -- --version 0.1.0
npm release:finalize -- --version 0.1.0
```

###### Releasing v1.0.0

When a package is &lt;v1.0.0, breaking changes will not bump the package to the next major
version. As such, a package's version will stay &lt;v1.0.0 until you tell the release
script to publish v1.0.0. This can be done using the `--version` option. For example:

```bash
npm release:preview -- --version 1.0.0
npm release:prep-changelog -- --version 1.0.0
npm release:finalize -- --version 1.0.0
```

###### Prerelease Version (e.g. Alpha, Beta, Release Candidate)

If you would like to create a prerelease of the next version, you can use the
`--prerelease` option to specify the prerelease type. For example, let's say your package
is currently at v1.0.2 and v1.1.0 will be the next version. However, you'd like to create
a v1.1.0-rc.0 before creating the final v1.1.0. To do this, you can pass a `--prerelease
rc` option (Values like `alpha` and `beta` also work). For example:

```bash
npm release:preview -- --prerelease rc
npm release:prep-changelog -- --prerelease rc
npm release:finalize -- --prerelease rc
```

## License

This software is released under the MIT license. See [the license file](LICENSE) for more
details.


[eslintconfig]: https://github.com/silvermine/eslint-config-silvermine
[eslintplugin]: https://github.com/silvermine/eslint-plugin-silvermine
