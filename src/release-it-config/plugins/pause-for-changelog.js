'use strict';

const { Plugin } = require('release-it');

class PauseForChangelog extends Plugin {
   async beforeRelease() {
      const { infile } = this.options;

      // Set up our interactive prompt.
      this.registerPrompts({
         pause: {
            type: 'confirm',
            message: () => { return `Paused for ${infile} edits. Continue?`; },
         },
      });

      // Execute the prompt.
      await this.step(
         {
            enabled: true,
            label: 'Pause for changelog update.',
            prompt: 'pause',
         }
      );
   }
}

module.exports = PauseForChangelog;
