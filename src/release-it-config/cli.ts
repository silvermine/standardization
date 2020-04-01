#!/usr/bin/env node
import releaseIt from 'release-it';
import releaseItOptions from './index';

const run = (): void => {
   const args = process.argv.slice(2) || [];

   console.log(args); // eslint-disable-line

   const argumentValues = args.length > 1 ? args.join(' ').split('=') : [];

   // TODO: Create interface for release-it options.
   const runRelease = (options: object): void => {
      let mergedOptions = Object.assign(releaseItOptions, options);

      releaseIt(mergedOptions)
         .then((output: any) => {
            console.log('(silvermine-release) finished:', output); // eslint-disable-line
         });
   };

   const preReleaseWhitelist = [
      'alpha',
      'beta',
      'rc',
   ];

   const preReleaseArgIndex = argumentValues.indexOf('--preRelease');

   const npmReleaseArgIndex = argumentValues.indexOf('--release-npm');

   let userConfig: { [label: string]: any} = {};

   console.log('silvermine-release:', argumentValues, preReleaseArgIndex); // eslint-disable-line

   if (preReleaseArgIndex > -1) {
      const preReleaseType = argumentValues[preReleaseArgIndex + 1];

      if (preReleaseWhitelist.indexOf(preReleaseType) === -1) {
         throw new Error(
            `Please provide a valid pre-release type such as: ${preReleaseWhitelist.join(', ')}`
         );
      }

      userConfig.preRelease = preReleaseType;
   }

   if (npmReleaseArgIndex > -1) {
      Object.assign(
         userConfig,
         {
            increment: false,
            plugins: [],
            git: Object.assign(
               releaseItOptions.git,
               {
                  push: true,
                  tag: true,
                  commit: false,
                  changelog: false,
               }
            ),
            npm: {
               publish: true,
            },
         }
      );
   }

   if (args[0] === '--help') {
      // eslint-disable-next-line
      console.log('(silvermine-release) Allowed commands: --preRelease, --release-npm');
   } else if (argumentValues.length > 0) {
      runRelease(userConfig);
   } else {
      // eslint-disable-next-line
      console.log(
         '(silvermine-release) Allowed commands: --preRelease, --release-npm, --help'
      );
   }
};

run();
