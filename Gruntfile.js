'use strict';

module.exports = function(grunt) {
   var config;

   config = {
      docs: {
         src: {
            md: [ './README.md' ],
         },
      },

      js: {
         all: [ '*.js', 'scripts/**/*.js' ],
      },
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),
      config: config,

      eslint: {
         target: config.js.all,
      },
   });

   grunt.loadNpmTasks('grunt-eslint');

   grunt.registerTask('default', [ 'standards' ]);
   grunt.registerTask('standards', [ 'eslint' ]);
};
