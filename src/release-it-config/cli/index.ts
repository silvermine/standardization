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

const getRecommendedVersion = (): Promise<Record<string, any>> => {
   return new Promise((resolve, reject) => {
      // TODO: Determine if recommended-bump is still needed:
      recommendedBump({ preset: 'conventionalcommits' }, (error: unknown, recommendation: Record<string, any>) => {
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

   const getOption = (arg: string): string => {
      return arg.split('=')[1];
   };

   const findArgument = (arg: string): string => {
      const matchedArgument = args.find((i: string) => {
         return i.indexOf(arg) > -1;
      });

      return matchedArgument ? matchedArgument.split('--')[1] : '';
   };

   let isExecutable = false,
       isExecutingChangelog = true,
       recommendedVersion: Record<string, any> = {};

   recommendedVersion = await getRecommendedVersion();

   console.log('recommended version', recommendedVersion);  // eslint-disable-line

   isExecutable = _.some(args, (arg: string): boolean => {
      const argument = (findArgument(arg) || '').split('=')[0],
            option = getOption(arg);

      if (argument === 'changelog') {
         return false;
      } else if (argument === 'release') {
         return true;
      } else if (argument === 'pre-release') {
         return preReleaseCommand([ option ], config);
      } else if (argument === 'tag') {
         isExecutingChangelog = false;
         return tag(config);
      }

      return false;
   });

   if ((!isExecutable && !isExecutingChangelog) || findArgument('--help') === 'help') {
      helpCommand();
      return;
   }

   if (isExecutable) {
      Object.assign(releaseItOptions, config);

      await releaseIt(config);
   }

   if (isExecutingChangelog) {
      const isPrintChangelogOnly = !isExecutable;

      await autoChangelog(isPrintChangelogOnly);
   }

   console.log('(silvermine-release) finished'); // eslint-disable-line
};

try {
   run();
} catch(error) {
   console.error(error); // eslint-disable-line
}
