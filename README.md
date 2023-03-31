# Silvermine Standardization Utilities

<!-- markdownlint-disable line-length -->
[![NPM Version](https://img.shields.io/npm/v/@silvermine/standardization.svg)](https://www.npmjs.com/package/@silvermine/standardization)
[![License](https://img.shields.io/github/license/silvermine/standardization.svg)](./LICENSE)
[![Build Status](https://app.travis-ci.com/silvermine/standardization.svg?branch=master)](https://app.travis-ci.com/silvermine/standardization)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
<!-- markdownlint-enable line-length -->


## What?

This repo aggregates many of the standards we use when developing our software, including:

   * Release process standardization
   * Markdown linting
   * SASS linting
   * Executing (but not configuring) JS/TS linting
   * Commit message linting
   * Editor configuration
   * Browserslist configuration files

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

Add a `.stylelintrc.yml` file to the root of your project with the following contents:

```yml
extends: ./node_modules/@silvermine/standardization/.stylelintrc.yml
```

Add a command the the `scripts` object of your project's `package.json` file as follows:

```json
"stylelint": "stylelint './path/to/scss/source/**/*.scss'"
```

### EditorConfig

[EditorConfig](https://editorconfig.org/) provides a default set of editor configuration
values to use in Silvermine projects.

Symlink the .editorconfig file to the root of your project and use the appropriate
extension for your editor:

`ln -s ./node_modules/@silvermine/standardization/.editorconfig`


### Commitlint

   * Add a file called commitlint.config.js to your project root with the following
     content:

   ```javascript
   'use strict';

   module.exports = {
      extends: [ '@silvermine/standardization/commitlint.js' ],
   };
   ```

   * Use git log --oneline to find the short hash of the previous commit and take note of
     it
   * Add the following NPM script to `package.json`:

   `"commitlint": "commitlint --from deadbeef"` (where deadbeef is the short hash from the
   previous step)

   * Add the new script to package.json, then add a call to commitlint in the `standards`
     NPM script.

      ```json
      {
         "scripts": {
            "commitlint": "commitlint --from deadbeef",
            "standards": "npm run commitlint && npm run eslint"
         }
      }
      ```

### Markdownlint

Add a file named `.markdownlint.json` to the root of your project with the
following content:

```json
{
   "extends": "./node_modules/@silvermine/standardization/.markdownlint.json"
}
```

Add the following script to package.json, and adjust the ignore argument as needed
to suit the needs of the project. Then add a call to markdownlint in the `standards`
NPM script.

```json
{
   "scripts": {
      "markdownlint": "markdownlint -c .markdownlint.json -i CHANGELOG.md '{,!(node_modules)/**/}*.md'",
      "standards": "npm run markdownlint && npm run eslint"
   }
}

```

### check-node-version

Add a `check-node-version` task to package.json, providing the desired version of Node.js
and NPM that you wish to enforce. Execute it as part of the `test` NPM script as well.

```json
{
   "scripts": {
      "check-node-version": "check-node-version --node 16.15.0 --npm 8.5.5",
      "test": "npm run check-node-version && nyc mocha -- -R spec 'tests/**/*.test.js'"
   }
}

```

`check-node-version` allows us to enforce a Node.js and NPM version for our projects. It's
possible that some processes in some projects could fail when the wrong version of Node.js
is enabled in the developer's environment. This helps eliminate one factor from the
equation when troubleshooting.

### Executing ESLint

When ESLint is needed for a project, add an `eslint` task to package.json, and execute it
as part of the `standards` NPM script as well:

```json
{
   "scripts": {
      "eslint": "eslint .",
      "standards": "npm run markdownlint && npm run eslint"
   }
}
```

### Browserlist

[Browserslist](https://github.com/browserslist/browserslist) provides configuration that
various front-end tools (Babel, Autoprefixer) use to determine which browsers should be
supported.

Symlink the appropriate .browserslistrc file to the root of your project.

For projects which require broad browser support (public-facing projects):

`ln -s
./node_modules/@silvermine/standardization/browserslist/.browserslistrc-broad-support
.browserslistrc`

For projects which only need limited browser support (internal projects):

`ln -s
./node_modules/@silvermine/standardization/browserslist/.browserslistrc-narrow-support
.browserslistrc`


### Release Process

#### Configuration

   1. Ensure that the project's `markdownlint` NPM script is configured as described in
      the [Markdownlint](#markdownlint) section below. Generated changelogs will fail our
      linting rules and must be excluded from linting.
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
      Changelog](#prepare-the-changelog))
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

   1. Run `npm run release:prep-changelog`. You should now be on a branch named
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
   1. Run `npm run release:finalize`
   1. Preview the changes and push the branch and `v${NEW_VERSION}` tag to the correct
      remote repo
   1. If the version should be published and this is not handled by a CI/CD pipeline, run
      `npm publish` to publish the package

##### Special Cases

In most cases, `npm run release:preview`, `npm run release:prep-changelog`, and `npm run
release:finalize` will be run without any additional options. However, there are a few
cases when you may need to supply extra options.

###### First Release

When a package is first created, the package.json typically says the version is v0.1.0.
If that's the version you want to generate the changelog for and publish to NPM, there's a
problem. The release script will want to bump the package to v0.2.0 or v0.1.1. As such, a
version of 0.1.0 has to be specified using the `--version` option. For example:

```bash
npm run release:preview -- --version 0.1.0
npm run release:prep-changelog -- --version 0.1.0
npm run release:finalize -- --version 0.1.0
```

###### Releasing v1.0.0

When a package is &lt;v1.0.0, breaking changes will not bump the package to the next major
version. As such, a package's version will stay &lt;v1.0.0 until you tell the release
script to publish v1.0.0. This can be done using the `--version` option. For example:

```bash
npm run release:preview -- --version 1.0.0
npm run release:prep-changelog -- --version 1.0.0
npm run release:finalize -- --version 1.0.0
```

###### Prerelease Version (e.g. Alpha, Beta, Release Candidate)

If you would like to create a prerelease of the next version, you can use the
`--prerelease` option to specify the prerelease type. For example, let's say your package
is currently at v1.0.2 and v1.1.0 will be the next version. However, you'd like to create
a v1.1.0-rc.0 before creating the final v1.1.0. To do this, you can pass a `--prerelease
rc` option (Values like `alpha` and `beta` also work). For example:

```bash
npm run release:preview -- --prerelease rc
npm run release:prep-changelog -- --prerelease rc
npm run release:finalize -- --prerelease rc
```

### Migration to `standards` NPM script

We are in the process of migrating away from grunt as a task runner. This being the case,
we are switching from `grunt standards` to `npm run standards` as our default "run the
linting/standards checks" command. The goal is to help reduce cognitive load for
developers when they begin work on a project. For example, they will not have to
ask the question:

> "What's the standards command I need to run? Does this project still use grunt?".

When updating projects, even if they still use `grunt` as the primary build tool,
we should:

1. Add a new `standards` NPM script which will run all the linting and standards-related
   scripts
   * If the project still relies on `grunt standards`, this script should contain a call
     to `grunt standards`
2. Replace any calls to `grunt standards` with `npm run standards` in CI configuration
   files (`.travis.yml`, etc)

Example:

```json
{
   "scripts": {
      "standards": "npm run markdownlint && grunt standards"
   }
}
```

## License

This software is released under the MIT license. See [the license file](LICENSE) for more
details.


[eslintconfig]: https://github.com/silvermine/eslint-config-silvermine
[eslintplugin]: https://github.com/silvermine/eslint-plugin-silvermine
