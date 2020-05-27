// import process from 'process';
import fs from 'fs';
import lineReader from 'line-reader';
import { promisify } from 'util';
import { exec } from 'child_process';
import {
   AUTOCHANGELOG_COMMAND,
   CHANGELOG_INFILE,
   CHANGELOG_HEADER,
   CHANGELOG_FOOTER
} from '../index';

// Provides a line count for the provided string.
const getMultilineStringLineCount = (multilineString: string) => {
   return multilineString.split(/\r\n|\r|\n/).length;
}

// Returns the first line of a multiline string.
const getFirstLineMultilineString = (multineString: string) => {
   if (getMultilineStringLineCount(multineString) <= 0) {
      return multineString;
   }

   return multineString.split('\n').find(line => line !== '');
}

/**
 * Executes auto-changelog and returns the results.
 */
const runAutochangelog = (): Promise<string> => {
   console.log('Generating changelog:', AUTOCHANGELOG_COMMAND, process.cwd()); // eslint-disable-line
   return new Promise((resolve, reject) => {
      exec(
         AUTOCHANGELOG_COMMAND,
         { cwd: process.cwd() },
         (error, stdout) => {

            if (error) {
               reject(error);
            }

            resolve(stdout);
         }
      );
   });
};

/**
 * Reads the changelog at the provided path, starting at the provided line number,
 * and returns the existing contents.
 *
 * @param infile Path to the changelog file to be written to.
 * @param startLineNumber Line number at which to start reading/
 */
const readCurrentChangelog = async (infile: string, startLineNumber: number): Promise<string> => {
   let lineCount = 0,
       existingChangelog = '';

   return new Promise((resolve) => {
      // Open the file for reading.
      lineReader.eachLine(infile, (line, isLast) => {
         const isLineChangeLogFooter = getFirstLineMultilineString(CHANGELOG_FOOTER) === line;

         if (isLast || isLineChangeLogFooter) {
            resolve(existingChangelog);
         }

         if (lineCount >= startLineNumber) {
            existingChangelog = existingChangelog.concat('\n' + line);
         }

         lineCount = lineCount + 1;
      });
   });
}

const run = async (): Promise<void> => {
   const stat = promisify(fs.stat),
         writeFile = promisify(fs.writeFile),
         writeStream = fs.createWriteStream,
         changelogHeaderLineCount = getMultilineStringLineCount(CHANGELOG_HEADER);

   let isChangelogExisiting = false,
       existingChangelog = '',
       stream: fs.WriteStream,
       fileOutput: string[],
       output: string;

   // Check for the changelog file.
   try {
      await stat(CHANGELOG_INFILE);
      isChangelogExisiting = true;
   } catch(error) {
      console.log('Changelog not present, creating...'); // eslint-disable-line
   }

   if (!isChangelogExisiting) {
      try {
         // Create a write out the file with our template.
         await writeFile(
            CHANGELOG_INFILE,
            `${CHANGELOG_HEADER}${CHANGELOG_FOOTER}`
         );
      } catch(error) {
         console.error('Error creating file:', error); // eslint-disable-line
      }
   }

   // Store the file contents in memory.
   existingChangelog = await readCurrentChangelog(CHANGELOG_INFILE, changelogHeaderLineCount);

   // Get latest changelog.
   output = await runAutochangelog();

   if (getFirstLineMultilineString(existingChangelog) === getFirstLineMultilineString(output)) {
      console.log('No new changes detected, exiting.'); // eslint-disable-line
      return;
   }

   stream = writeStream(CHANGELOG_INFILE, { encoding: 'utf8' });

   fileOutput = [
      CHANGELOG_HEADER,
      output,
      existingChangelog,
      CHANGELOG_FOOTER
   ];

   stream.write(fileOutput.join('\n'));
};

run();

export default run;
