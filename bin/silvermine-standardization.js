#!/usr/bin/env node
/* eslint no-console: [ "error", { allow: [ "info", "warn", "error" ] } ] */
'use strict';

const commander = require('commander'),
      chalk = require('chalk'),
      { createReleaseCommand } = require('../scripts/release-command');

async function main() {
   const program = new commander.Command('silvermine-standardization');

   program.addCommand(createReleaseCommand({ cwd: process.cwd() }));
   program.action(() => {
      program.outputHelp();
   });
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
