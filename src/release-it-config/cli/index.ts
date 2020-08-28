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
         config = Object.assign({}, releaseItOptions),
         // TODO: Support additional args for auto-changelog
         changelogArgs: string[] = [];

   // Find a single argument if provided to a subcommand.
   // Example: silvermine-release my-command=argument
   const getArgument = (arg: string): string => {
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
      const subCommand = (findSubCommand(arg) || '').split('=')[0];

      if (subCommand === 'changelog') {
         return false;
      } else if (subCommand === 'release') {
         return true;
      } else if (subCommand === 'pre-release') {
         const prefix = getArgument(findSwitch('prefix'));

         const preReleaseCommandResults = preReleaseCommand(prefix, config, recommendedVersion.releaseType);

         isExecutingChangelog = false;

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
      // TODO: We will implement our own changelog generator since auto-changelog does
      // not support our requirements. Until then, disabling writing out the changelog.
      await autoChangelog(false, changelogArgs);
   }

   console.log('(silvermine-release) finished'); // eslint-disable-line no-console
};

run();
