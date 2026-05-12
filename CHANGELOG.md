# Changelog

All notable changes to this project will be documented in this file.
See [our coding standards][commit-messages] for commit guidelines.

## [3.0.0](https://github.com/silvermine/standardization/compare/v2.2.3...v3.0.0) (2026-05-12)


### ⚠ BREAKING CHANGES

* Stylelint deprecated and removed many rules that they
considered to be 'stylelistic'. Many of those rules are re-implemented in the
@stylelistic/stylelint package. One rule was not moved there and so is now no
longer linted: `function-calc-no-invalid`.

See: https://github.com/stylelint/stylelint/issues/5713

### Features

* add --no-branch option to prep-changelog ([f1ef13e](https://github.com/silvermine/standardization/commit/f1ef13e128ca91da77d81626033d8ef6e3df44f3))
* add scss at no unknown rule to vue files ([2787c28](https://github.com/silvermine/standardization/commit/2787c28364bc55a7579da09c8cc61f315b256c3e))
* add stylelint duplicate properties rule ([3153d8f](https://github.com/silvermine/standardization/commit/3153d8f5df11844d124809f2588d1b93aae7b9c6))
* add vue support to stylelint ([200c2d0](https://github.com/silvermine/standardization/commit/200c2d02229b23b346c3ef653c0587e2ae44e16a))
* expose silvermine-standardization release CLI bin ([d43c379](https://github.com/silvermine/standardization/commit/d43c37995467fecbc90ddd8be687c5916dcb1431))
* utilize gitignore for markdownlint ([366e224](https://github.com/silvermine/standardization/commit/366e2248511b7581d2337e88fa04808e15878e69))


### Bug Fixes

* allow Vue's custom CSS selectors in Stylelint config ([#85](https://github.com/silvermine/standardization/issues/85)) ([57c8bdb](https://github.com/silvermine/standardization/commit/57c8bdbc69adf3bcb3e8514051059d1a3807ae3d))
* consume new no-multiple-space-blockquote.list_items ([7d6c8cd](https://github.com/silvermine/standardization/commit/7d6c8cd9d2310f57f067f2d385b9377ce97f56c5)), closes [/github.com/DavidAnson/markdownlint/issues/1473#event-17506656561](https://github.com/silvermine//github.com/DavidAnson/markdownlint/issues/1473/issues/event-17506656561)
* update markdownlint config for duplicate headers ([5a294d5](https://github.com/silvermine/standardization/commit/5a294d5edf4fa1ee35205bef5f902bb44b27a2de))


### Miscellaneous Chores

* update stylelint to v16 ([2473318](https://github.com/silvermine/standardization/commit/24733181b35f67e8e0e143387abc05774064982b))


### [2.2.3](https://github.com/silvermine/standardization/compare/v2.2.2...v2.2.3) (2024-05-23)


### Miscellaneous Chores

* upgrade @silvermine/markdownlint-rule-indent-alignment ([a38b6e7](https://github.com/silvermine/standardization/commit/a38b6e74674c39607cfb6fa605269afae8b37a48))


### [2.2.2](https://github.com/silvermine/standardization/compare/v2.2.1...v2.2.2) (2023-11-16)


### Bug Fixes

* newline setting in editorconfig ([3029239](https://github.com/silvermine/standardization/commit/3029239718ba1918d2f27e3e100f0c5f7759de60)), closes [#72](https://github.com/silvermine/standardization/issues/72)


### [2.2.1](https://github.com/silvermine/standardization/compare/v2.2.0...v2.2.1) (2023-11-10)


### Bug Fixes

* disallow fixup! commit messages in our commitlint config ([80a32d1](https://github.com/silvermine/standardization/commit/80a32d1648d7ef279dba2b83b07e7c58c32eaa3c))


## [2.2.0](https://github.com/silvermine/standardization/compare/v2.1.1...v2.2.0) (2023-07-20)


### Features

* Add custom rule 'indent-alignment' ([e9644c9](https://github.com/silvermine/standardization/commit/e9644c97d4092cd4f52f390c94ef0bb01de2056b))
* install markdownlint-cli2 and add configuration ([523fb68](https://github.com/silvermine/standardization/commit/523fb6881bd355a1beeae32d5002a817a29906f1))


### Bug Fixes

* markdownlint ignore settings apply to subdirectories ([b419416](https://github.com/silvermine/standardization/commit/b4194164926f9e8c5f1222c3aab2135c2d891a53))


### [2.1.1](https://github.com/silvermine/standardization/compare/v2.1.0...v2.1.1) (2023-02-09)


### Bug Fixes

* disable MD051/link-fragments ([322df7d](https://github.com/silvermine/standardization/commit/322df7da87d7ff276b0657287f40655768238c84))


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
