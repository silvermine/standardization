#!/usr/bin/env node
import releaseIt from 'release-it';
import _ from 'underscore';
import recommendedBump from 'conventional-recommended-bump';
import releaseItOptions from '../';
import autoChangelog from '../../auto-changelog-config/auto-changelog';
import {
   preReleaseCommand,
   tag,
   helpCommand,
} from './commands';

const getRecommendedVersion = (): Promise<recommendedBump.Callback.Recommendation> => {
   return new Promise((resolve, reject) => {
      recommendedBump({ preset: 'conventionalcommits' }, (error: unknown, recommendation) => {
         if (error) {
            reject(error);
         }

         resolve(recommendation);
      });
   });
};

const run = async (): Promise<void> => {
   const args = process.argv || [],
         config = Object.assign({}, releaseItOptions);

   // Find a single argument if provided to a subcommand.
   // Example: silvermine-release my-command=argument
   const getArgment = (arg: string): string => {
      return arg.split('=')[1];
   };

   // Find a single switch if provided along with commands.
   // Example: silvermine-release my-command --switch
   const findSwitch = (arg: string): string => {
      const matchedSwitch = args.find((i: string) => {
         return i.indexOf(arg) > -1;
      });

      return matchedSwitch ? matchedSwitch.split('--')[1] : '';
   };

   // Find a single subcommand provided to the tool.
   // Example: silvermine-release im-a-command
   const findSubCommand = (arg: string): string => {
      const argIndex = args.indexOf(arg);

      return argIndex > -1 ? args[argIndex] : '';
   };

   let isExecutable = false,
       isExecutingChangelog = true,
       recommendedVersion: recommendedBump.Callback.Recommendation = {};

   recommendedVersion = await getRecommendedVersion();

   isExecutable = _.some(args, (arg: string): boolean => {
      const subCommand = (findSubCommand(arg) || '').split('=')[0],
            option = getArgment(arg);

      if (subCommand === 'changelog') {
         return false;
      } else if (subCommand === 'release') {
         return true;
      } else if (subCommand === 'pre-release') {
         const preReleaseCommandResults = preReleaseCommand([ option ], config, recommendedVersion.releaseType);

         isExecutingChangelog = preReleaseCommandResults;

         return preReleaseCommandResults;
      } else if (subCommand === 'tag') {
         isExecutingChangelog = false;
         return tag(config);
      }

      return false;
   });

   if ((!isExecutable && !isExecutingChangelog) || !!findSwitch('help')) {
      helpCommand();
      return;
   }

   if (isExecutable) {
      console.log('Recommended version:', recommendedVersion); // eslint-disable-line no-console

      Object.assign(releaseItOptions, config);

      await releaseIt(config);
   }

   if (isExecutingChangelog) {
      await autoChangelog(!!findSwitch('write'));
   }

   console.log('(silvermine-release) finished'); // eslint-disable-line no-console
};

try {
   run();
} catch(error) {
   console.error(error); // eslint-disable-line no-console
}
