# Changelog

All notable changes to this project will be documented in this file.
See [our coding standards][commit-messages] for commit guidelines.

## [2.1.0](https://github.com/silvermine/standardization/compare/v2.0.0...v2.1.0) (2023-02-09)


### Features

* drop support for node 12 ([f04dcba](https://github.com/silvermine/standardization/commit/f04dcbac2edbbedae45c98699301d6536d50e4da))
* upgrade markdownlint-cli to pull in rule improvements ([6e808ae](https://github.com/silvermine/standardization/commit/6e808aecf34634974c41713e7b97a42a35afb63d))


### Bug Fixes

* allow markdown tables to exceed the 90 character limit ([b2119fe](https://github.com/silvermine/standardization/commit/b2119fe9a294c6031cec5274f8d9d8842302f768))
* require words passing the 90 char markdown limit to be wrapped ([4799023](https://github.com/silvermine/standardization/commit/47990230e8e13fb9d3c1423fc4350fc6d5cf6939))


## [2.0.0](https://github.com/silvermine/standardization/compare/v1.3.0...v2.0.0) (2022-04-28)


### ⚠ BREAKING CHANGES

* Removes Grunt.js support dependencies. Consumers that still
rely on Grunt.js as a build system will need to include their own Grunt.js
dependencies when upgrading to this version of Standardization.

### Miscellaneous Chores

* remove Grunt.js dependencies and configuration ([494a52c](https://github.com/silvermine/standardization/commit/494a52c2787368563ca9bfc0897709fbdf6f3c80))


## [1.3.0](https://github.com/silvermine/standardization/compare/v1.2.1...v1.3.0) (2022-03-18)


### Features

* Add Browserslist configuration options ([#24](https://github.com/silvermine/standardization/issues/24)) ([676ea20](https://github.com/silvermine/standardization/commit/676ea202c0681210b88ed031f6ff4d02a29f6b15))
* add script to simplify the package release process ([#27](https://github.com/silvermine/standardization/issues/27)) ([c5d0f3c](https://github.com/silvermine/standardization/commit/c5d0f3cc393031ca4e53b7576a220778ed9a1927))


### [1.2.1](https://github.com/silvermine/standardization/compare/v1.2.0...v1.2.1) (2022-01-25)


### Features

* Disable no-inline-html markdown rule ([#30](https://github.com/silvermine/standardization/issues/30)) ([9e3e02f](https://github.com/silvermine/standardization/commit/9e3e02f000eec149ba744a5b2228ffb2403be950))

## [1.2.0](https://github.com/silvermine/standardization/compare/v1.1.0...v1.2.0) (2021-09-06)

## [1.1.0](https://github.com/silvermine/standardization/compare/v1.0.3...v1.1.0) (2021-05-12)


### Features

* Add stylelint for SCSS linting ([af496d5](https://github.com/silvermine/standardization/commit/af496d5c36186fa79181bb452e142c038a1d8167))

### [1.0.3](https://github.com/silvermine/standardization/compare/v1.0.2...v1.0.3) (2021-05-11)


### Features

* drop sass-lint ([8c5ef66](https://github.com/silvermine/standardization/commit/8c5ef660c8ae63645b430768ca879551b85b9d27))

### [1.0.2](https://github.com/silvermine/standardization/compare/v1.0.1...v1.0.2) (2021-05-11)


### Bug Fixes

* last version bump used invalid commit message syntax ([2f28dc8](https://github.com/silvermine/standardization/commit/2f28dc89b084af994dca17b1558a74f829ddfe46))
* update packages to fix underscore/lodash vulnerability ([bafb21b](https://github.com/silvermine/standardization/commit/bafb21b4b5c29558d13c1ec2fa53089dc7ead3a3))

### [1.0.1](https://github.com/silvermine/standardization/compare/v1.0.0...v1.0.1) (2020-05-27)

## [1.0.0](https://github.com/silvermine/standardization/compare/b9af7da2b79c340dd1bd499f40ad4166a772ff58...v1.0.0) (2020-05-20)


### Bug Fixes

* version number was incorrect ([b9af7da](https://github.com/silvermine/standardization/commit/b9af7da2b79c340dd1bd499f40ad4166a772ff58))


[commit-messages]: https://github.com/silvermine/silvermine-info/blob/master/commit-history.md#commit-messages
