'use strict';

// This file holds the shared stylelint configuration. `.stylelintrc.yml` extends it, so
// projects keep extending `@silvermine/standardization/.stylelintrc.yml` as before.
//
// The custom syntax parsers are resolved to absolute paths here. Stylelint imports a
// `customSyntax` given as a bare package name from its own location, so "postcss-scss"
// is not found when npm nests the parser under this package instead of hoisting it next
// to stylelint. That happens, for example, when a project upgrades from v2 of this
// package with an existing package-lock.json.

// Rules that stylelint-config-standard enables for CSS but that conflict with SCSS. They
// apply to `.scss` files and to the `<style>` blocks of `.vue` files alike. Overrides
// select rules per file, not per `<style lang>`, so a plain `<style>` block in a `.vue`
// file also gets these rules. We expect Vue style blocks to use `lang="scss"`.
const SCSS_RULES = {
   // Turn off config-standard rule in favor of the scss/at-rule-no-unknown rule
   'at-rule-no-unknown': null,
   'scss/at-rule-no-unknown': true,
   'annotation-no-unknown': null,
   'at-rule-descriptor-no-unknown': null,
   'at-rule-descriptor-value-no-unknown': null,
   'at-rule-prelude-no-invalid': null,
   'import-notation': null, // We can remove this once all SCSS is using @use
   'declaration-property-value-no-unknown': null,
   'media-query-no-invalid': null,
   'function-no-unknown': null,
   'media-feature-name-value-no-unknown': null,
   // Collection of rules for if/else statements
   'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
   'scss/at-else-closing-brace-space-after': 'always-intermediate',
   'scss/at-else-empty-line-before': 'never',
   'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
   'scss/at-if-closing-brace-space-after': 'always-intermediate',
   // End collection of rules for if/else statements
   'scss/at-extend-no-missing-placeholder': true,
   'scss/at-function-parentheses-space-before': 'never',
   'scss/at-mixin-parentheses-space-before': 'never',
};

module.exports = {

   // We are using stylelint-config-standard for all of the base rules designed more
   // broadly for CSS. The stylelint-scss plugin provides us with more SCSS specific
   // rules. Those rules are prefixed by `scss/`
   extends: [ 'stylelint-config-standard' ],

   plugins: [
      'stylelint-scss',
      '@stylistic/stylelint-plugin',
   ],

   rules: {
      // Turn off the following rule since our ltr/rtl approach generally violates it.
      'no-descending-specificity': null,
      // General rules
      '@stylistic/indentation': 3,
      '@stylistic/linebreaks': 'unix',
      '@stylistic/no-eol-whitespace': true,
      '@stylistic/no-missing-end-of-source-newline': true,
      '@stylistic/no-empty-first-line': true,
      '@stylistic/max-line-length': [ 140, { ignorePattern: [ '/https?://[0-9,a-z]*.*/' ] } ],
      '@stylistic/max-empty-lines': 1,
      '@stylistic/string-quotes': 'single',
      'string-no-newline': true,
      '@stylistic/color-hex-case': 'lower',
      'color-hex-length': 'long',
      'color-no-invalid-hex': true,
      'no-invalid-position-at-import-rule': null,
      '@stylistic/number-leading-zero': 'always',
      '@stylistic/number-no-trailing-zeros': true,
      '@stylistic/unit-case': 'lower',
      'unit-no-unknown': true,
      'property-no-unknown': true,
      'block-no-empty': true,
      'value-keyword-case': 'lower',
      'length-zero-no-unit': true,
      '@stylistic/function-comma-space-after': 'always-single-line',
      '@stylistic/function-comma-space-before': 'never',
      '@stylistic/function-parentheses-space-inside': 'never-single-line',
      'function-linear-gradient-no-nonstandard-direction': true,
      'function-calc-no-unspaced-operator': true,
      // Allow Vue's `:deep()`, `:global()`, and `:slotted()` selectors
      'selector-pseudo-class-no-unknown': [ true, { ignorePseudoClasses: [ 'global', 'deep', 'slotted' ] } ],
      'selector-pseudo-element-no-unknown': true,
      'selector-type-no-unknown': true,
      // Allow intentional duplicate properties for progressive enhancement (e.g., vh/dvh
      // fallbacks)
      'declaration-block-no-duplicate-properties': [ true, { ignore: [ 'consecutive-duplicates-with-different-values' ] } ],
      'declaration-block-no-shorthand-property-overrides': true,
      '@stylistic/declaration-colon-space-after': 'always',
      '@stylistic/declaration-colon-space-before': 'never',
      '@stylistic/declaration-block-trailing-semicolon': 'always',
      'declaration-empty-line-before': 'never',
      'comment-whitespace-inside': 'always',
      'rule-empty-line-before': [ 'always', { ignore: [ 'after-comment', 'inside-block' ] } ],
      // Collection of rules for if/else statements
      'at-rule-empty-line-before': [
         'always',
         {
            ignoreAtRules: [ 'else' ],
            ignore: [ 'after-comment', 'first-nested', 'inside-block', 'blockless-after-same-name-blockless' ],
         },
      ],
      '@stylistic/block-opening-brace-space-before': 'always',
      '@stylistic/block-closing-brace-newline-after': [ 'always', { ignoreAtRules: [ 'if', 'else' ] } ],
      '@stylistic/at-rule-name-space-after': 'always',
      // End collection of rules for if/else statements
      // Disable newly-added rules that cause linting errors until we can evaluate them
      'color-function-alias-notation': null,
      'alpha-value-notation': null,
      'shorthand-property-no-redundant-values': null,
      'property-no-vendor-prefix': null,
      'custom-property-pattern': null,
      'selector-class-pattern': null,
      'keyframes-name-pattern': null,
      'selector-id-pattern': null,
      'declaration-block-no-redundant-longhand-properties': null,
      'media-feature-range-notation': null,
      'selector-not-notation': null,
      'color-function-notation': null,
      'keyframe-selector-notation': null,
      'at-rule-no-vendor-prefix': null,
      'keyframe-block-no-duplicate-selectors': null,
      'function-url-quotes': null,
      'number-max-precision': null,
   },

   overrides: [
      {
         files: [ '**/*.scss' ],
         customSyntax: require.resolve('postcss-scss'),
         rules: SCSS_RULES,
      },
      {
         files: [ '**/*.vue' ],
         customSyntax: require.resolve('postcss-html'),
         rules: SCSS_RULES,
      },
   ],

};
