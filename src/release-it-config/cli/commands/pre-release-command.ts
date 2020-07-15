import { IReleaseItOptions } from '../../interfaces';

export default (
   options: string[],
   config: IReleaseItOptions,
   releaseType?: 'major' | 'minor' | 'patch'
): boolean => {
   const option = options[0];

   const preReleaseWhitelist = [
      'alpha',
      'beta',
      'rc',
   ];

   if (preReleaseWhitelist.indexOf(option) === -1) {
      // eslint-disable-next-line
      console.error(
         `Please provide a valid pre-release type such as: ${preReleaseWhitelist.join(', ')}`
      );
      return false;
   }

   config.increment = releaseType;
   config.preRelease = option;
   config.plugins = {};
   config.git.changelog = false;

   return true;
};
