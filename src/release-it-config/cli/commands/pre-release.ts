import { IReleaseItOptions } from '../../interfaces';
import _ from 'underscore';

export default (
   option: string,
   config: IReleaseItOptions,
   releaseType?: 'major' | 'minor' | 'patch'
): boolean => {
   const preReleaseWhitelist = [
      'alpha',
      'beta',
      'rc',
   ];

   const prereleasePrefix = _.isEmpty(option) ? 'rc' : option;

   if (prereleasePrefix !== 'rc' && preReleaseWhitelist.indexOf(prereleasePrefix) === -1) {
      // eslint-disable-next-line no-console
      console.error(
         `Please provide a valid pre-release type such as: ${preReleaseWhitelist.join(', ')}`
      );
      return false;
   }

   config.increment = releaseType;
   config.preRelease = prereleasePrefix;
   config.plugins = {};
   config.git.changelog = false;

   return true;
};
