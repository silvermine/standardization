# Silvermine Standardization Utilities

[![NPM Version][npm-version]][npm-version-url]
[![License][license-badge]](./LICENSE)
[![Build Status][build]][build-url]
![Conventional Commits][conventional]

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
repo because of specific naming requirements for providing ESLint config and plugins.

**NOTE:** Along with the _configuration files_ for the above standards, this repo also
includes the tools/dependencies needed to enforce those standards, such as
`markdownlint-cli2`. Just install `@silvermine/standardization` and you will also receive
`markdownlint-cli2`, `check-node-version`, `stylelint`, etc. (except for ESLint, as noted
above). This has a few benefits, including:

   * Ensuring our projects are using the same version of these CLI tools to reduce
     inconsistency and confusion
   * Reducing the number of dependencies that each project needs to maintain/upgrade
     individually
   * Ensuring that the version of each CLI tool our projects use is compatible with the
     config files in this repo for a given `@silvermine/standardization` version

So, when installing `@silvermine/standardization` in your project, you _should not install
the CLI tools listed in this project's package.json `dependencies`._ Instead, allow
`@silvermine/standardization` to provide them.

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

     `"commitlint": "commitlint --from deadbeef"` (where deadbeef is the short hash from
     the previous step)

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

Add a file named `.markdownlint-cli2.cjs` to the root of your project with the
following content:

```js
'use strict';

const sharedStandards = require(`@silvermine/standardization/.markdownlint-cli2.shared.cjs`);

module.exports = {

   ...sharedStandards,

   // optional
   globs: [
      ...sharedStandards.globs,
      "some/folder/path/or/glob/*.md"
   ],

   // optional
   ignores: [
      ...sharedStandards.ignores,
      "some/folder/path/or/glob/"
   ]

};
```

Optionally, you can provide your own `globs` and `ignores` arrays as necessary given
the directory and file structure of the project.

Add the following script to package.json, then add a call to the new markdownlint
script to the `standards` NPM script.

```json
{
   "scripts": {
      "markdownlint": "markdownlint-cli2",
      "standards": "npm run markdownlint && npm run eslint"
   }
}

```

### check-node-version

Add a `check-node-version` task to package.json, providing the desired version of NPM that
you wish to enforce. Execute this NPM script as part of the project's CI definition.

```json
{
   "scripts": {
      "check-node-version": "check-node-version --npm 8.5.5"
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

### Badges For README.md In Public Repos

It can be useful to include badges in the main README.md of our public repos, conveying
visual information quickly for anyone viewing the documentation for a project. When
including badges, the following are suggested:

   * NPM version
   * Project License
   * GitHub Actions build status
   * Coveralls coverage status (if applicable)
   * Conventional Commits badge

It can be helpful to use [Markdown reference-style links][markdown-doc-ref-links] to
build these badges, as they often contain long URLs that can trigger errors from
our Markdownlint line-length rules.

Example:

```markdown
# Project Title

<!-- Top of file -->
[![NPM Version][npm-version]][npm-version-url]
[![License][license-badge]](./LICENSE)
[![Build Status][build]][build-url]
[![Coverage Status][coverage]][coverage-url]
![Conventional Commits][conventional]

<!-- Bottom of file -->
[npm-version]: https://img.shields.io/npm/v/@silvermine/project-name.svg
[npm-version-url]: https://www.npmjs.com/package/@silvermine/project-name
[license-badge]: https://img.shields.io/github/license/silvermine/project-name.svg
[build]: https://github.com/silvermine/project-name/actions/workflows/ci.yml/badge.svg
[build-url]: https://travis-ci.org/silvermine/project-name.svg?branch=master
[coverage]: https://coveralls.io/repos/github/silvermine/project-name/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/silvermine/project-name?branch=master
[conventional]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
```

Be sure to replace `project-name` with the appropriate segment of the project URL.

### Release Process

#### Configuration

   1. Ensure that the project's `markdownlint` NPM script is configured as described in
      the [Markdownlint](#markdownlint) section below. Generated changelogs will fail our
      linting rules and must be excluded from linting.
   1. Ensure that the project's `package.json` file has a
      [`repository.url`][package-json-link] field with the URL to the canonical repo
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

[markdown-doc-ref-links]: https://daringfireball.net/projects/markdown/syntax#link
[npm-version]: https://img.shields.io/npm/v/@silvermine/standardization.svg
[npm-version-url]: https://www.npmjs.com/package/@silvermine/standardization
[license-badge]: https://img.shields.io/github/license/silvermine/standardization.svg
[build]: https://github.com/silvermine/standardization/actions/workflows/ci.yml/badge.svg
[build-url]: https://travis-ci.org/silvermine/standardization.svg?branch=master
[conventional]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[eslintconfig]: https://github.com/silvermine/eslint-config-silvermine
[eslintplugin]: https://github.com/silvermine/eslint-plugin-silvermine
[package-json-link]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository
