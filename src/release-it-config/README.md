# Silvermine-release

If you have this project installed globally you can use the following commands:


## Run a Release

With a clean working directory, run:

`silvermine-release release`

Begins the release process for a full release:

   * Calculates the next semver version number and bumps the version in `package.json`.
   * Commits the changes.
   * Generates a changelog of all the features and bugfixes since the last release.

At this point, it is recommended that you edit CHANGELOG.md as desired, then amend the
release commits with those changes.

## Run a Prerelease

With a clean working directory, run:

`silvermine-release pre-release`

This will generate an `rc` release by default.

You can also generate an `alpha` release:

`silvermine-release pre-release --prefix=alpha`

...or a `beta`:

`silvermine-release pre-release --prefix=beta`

Begins the release process for a pre-release version:

   * Calculates the next semver version number and bumps the version in `package.json`.
   * Commits the changes.
   * Prints out a changelog of all the features and bugfixes since the last release.

## Tag the Release

With a clean working directory, run:

`silvermine-release tag`

Creates git tags for publishing a release:

   * Creates the local tag based on the current version found in
     package.json.
   * Pushes the tag to your repository.

## Print the changelog

You can use the tool to get a report of the latest changes (even for a pre-release):

`silvermine-release changelog`

NOTE: A future version will provide our own changelog generation that better suits our needs.
For now, this is here for convenience or if the developer needs a quick way to get most recent
changes from the project history.

## NPM Scripts

To avoid having to install the global package, you can also add npm scripts
to your `package.json`'s `scripts: {}` object.

For example:

```json
   "release-rc": "silvermine-release pre-release",
   "release": "silvermine-release release"
```

## Using NPX

Since version 5.2.0, NPM ships with [NPX](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner),
and it can be used to execute silvermine-release:

`npx silvermine-release {command}`

## Use Config Only

If you want to skip using the tool, and instead use `release-it` as intended,
you can do that too.

Add a file called `.release-it.js` to your project root, with the following contents:

```javascript
'use strict';

const config = require('@silvermine/standardization/release-it-config');

module.exports = {
   plugins: config.plugins,
   git: config.git,
   gitHub: config.gitHub,
   npm: config.npm,
};
```

You can [configure the above](https://www.npmjs.com/package/release-it#configuration)
as neccessary to suit your project.

You can now run `release-it` commands, passing our config:

`release-it --config='release-it.js'`


## Release Process

1. With a clean working directory, checkout a branch for your release,
   something like `user/prepare-vYOUR.VERSION.NUMBER`.

2. Run `silvermine-release release` (or `pre-release={rc | alpha | beta}`).
   * Press `Y` when prompted to commit the version bump.
   * If you need to maintain a changelog, you can grab a list of commits
     from the output of `silvermine-release changelog`, and manually add
     any commits you desire. Amend the release commit with your
     changelog edits.
   * Push the branch and create a PR or MR for the release.

3. Once merged, run `silvermine-release tag`.
   * Press `Y` to tag the release.
   * Press `Y` to push the tags.

4. Publish
   * At this point you can run the registry release manually if applicable.


## Development

For development in this project, you can install the project globally as follows:

Run a build: `grunt build`

Install the project globally: `npm i -g ./` or `npm link`

## Fixing Problems

   * **Commit/Bump**: If you need to bail out of the process during this step, you can simply
     issue `CTRL + C` and release-it will gracefully roll back any changes for you.
   * **Tagging**: If something goes wrong during this step (such as if you had changes locally
     but not on the remote), you will either have to:
      * Delete the local/remote tag: `git tag -d TAGNAME`, `git push -d origin TAGNAME`
      * Or, if you have the tag locally, but not remotely, push the tag manually:
        `git push origin TAGNAME`.
