'use strict';

module.exports = function (grunt) {
   var config;

   config = {
      docs: {
         src: {
            md: [ './README.md' ],
         },
      },

      markdownlintConfig: grunt.file.readJSON('.markdownlint.json'),
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),
      config: config,

      markdownlint: {
         all: {
            src: [ ...config.docs.src.md ],
            options: {
               config: config.markdownlintConfig,
            },
         },
      },
   });

   grunt.loadNpmTasks('grunt-markdownlint');

   grunt.registerTask('default', [ 'standards' ]);
   grunt.registerTask('standards', [ 'markdownlint' ]);
};
