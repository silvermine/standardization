'use strict';

module.exports = (grunt) => {
   let config,
       appConfigs;

   // Configurations for different CLI apps maintained in this project.
   appConfigs = {
      releaseIt: {
         dirName: 'release-it-config',
      },
   };

   config = {
      js: {
         gruntFile: 'Gruntfile.js',
         all: [
            './*.js',
            './src/**/*.js',
         ],
         releaseIt: {
            plugins: `./src/${appConfigs.releaseIt.dirName}/plugins/**/*.js`,
         },
      },
      hbs: {
         templates: `./src/${appConfigs.releaseIt.dirName}/auto-changelog/templates/*.hbs`,
      },
      ts: {
         src: './src/**/*.ts',
         all: [
            './*.ts',
            './src/**/*.ts',
         ],
         configs: {
            standards: 'tsconfig.json',
            types: 'src/tsconfig.types.json',
            releaseIt: `src/${appConfigs.releaseIt.dirName}/tsconfig.json`,
         },
      },
      commands: {
         tsc: './node_modules/.bin/tsc',
      },
      docs: {
         src: {
            md: [ './README.md' ],
         },
      },
      out: {
         dist: './dist/',
         releaseIt: {
            // Should this path change we should update the resolved path to plugins
            // in src/release-it-config/config.ts.
            plugins: `./dist/${appConfigs.releaseIt.dirName}/plugins`,
            templates: `./dist/${appConfigs.releaseIt.dirName}/auto-changelog/templates`,
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

      eslint: {
         target: [ ...config.js.all, ...config.ts.all ],
         fix: {
            src: [ ...config.js.all, ...config.ts.all ],
            options: {
               fix: true,
            },
         },
      },

      exec: {
         options: {
            failOnError: true,
         },
         standards: {
            cmd: `${config.commands.tsc} -p ${config.ts.configs.standards} --pretty`,
         },
         types: {
            cmd: `${config.commands.tsc} -p ${config.ts.configs.types} --pretty`,
         },
         silvermineRelease: {
            cmd: `${config.commands.tsc} -p ${config.ts.configs.releaseIt} --pretty`,
         },
      },

      clean: { dist: config.out.dist },

      concurrent: {
         'build-ts-outputs': [ 'build-types', 'build-tools' ],
      },

      copy: {
         main: {
            files: [
               {
                  expand: true,
                  flatten: true,
                  src: config.js.releaseIt.plugins,
                  dest: config.out.releaseIt.plugins,
               },
               {
                  expand: true,
                  flatten: true,
                  src: config.hbs.templates,
                  dest: config.out.releaseIt.templates,
               },
            ],
         },
      },

      watch: {
         ts: {
            files: [ config.ts.src ],
            tasks: [ 'build-ts-outputs' ],
         },
         gruntFile: {
            files: [ config.js.gruntFile ],
            options: {
               reload: true,
            },
         },
      },
   });

   grunt.loadNpmTasks('grunt-eslint');
   grunt.loadNpmTasks('grunt-exec');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-concurrent');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-markdownlint');

   grunt.registerTask('standards', [ 'eslint:target', 'exec:standards', 'markdownlint' ]);
   grunt.registerTask('standards-fix', [ 'eslint:fix' ]);

   grunt.registerTask('build-types', [ 'exec:types' ]);
   grunt.registerTask('build-tools', [ 'exec:silvermineRelease' ]);
   grunt.registerTask('build-ts-outputs', [ 'concurrent:build-ts-outputs' ]);
   grunt.registerTask('build', [ 'concurrent:build-ts-outputs', 'copy:main' ]);

   grunt.registerTask('develop', [ 'clean:dist', 'build', 'watch' ]);

   grunt.registerTask('default', [ 'standards' ]);
};
