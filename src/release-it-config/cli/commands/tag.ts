import { IReleaseItOptions } from '../../interfaces';

export default (config: IReleaseItOptions): boolean => {
   Object.assign(
      config,
      {
         increment: false,
         plugins: [],
         git: Object.assign(
            config.git,
            {
               push: true,
               tag: true,
               commit: false,
               changelog: false,
            }
         ),
      }
   );

   return true;
};
