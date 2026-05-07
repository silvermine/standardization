/* eslint no-console: [ "error", { allow: [ "info", "warn", "error" ] } ] */
'use strict';

const commander = require('commander'),
      chalk = require('chalk'),
      { createReleaseCommand } = require('./release-command');

console.warn(chalk.yellow(
   '[deprecated] scripts/release.js will be removed in a future release. '
   + 'Use `silvermine-standardization release <command>` instead.'
));

async function main() {
   const program = createReleaseCommand({ cwd: process.cwd() });

   program.exitOverride();

   try {
      await program.parseAsync(process.argv);
   } catch(err) {
      if (err instanceof commander.CommanderError) {
         program.outputHelp();
      } else {
         console.error(chalk.red.bold(`ERROR: ${err}`) + `\n${err.stack}`);
      }

      process.exit(1); // eslint-disable-line no-process-exit
   }
}

main();
