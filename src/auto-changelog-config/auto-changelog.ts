// import process from 'process';
import fs from 'fs';
import lineReader from 'line-reader';
import { promisify } from 'util';
import executeShellCommand from '../utilities/execute-shell-command';
import {
   autoChangelogCommand,
   CHANGELOG_INFILE,
} from '../index';
import {
   CHANGELOG_HEADER,
   CHANGELOG_FOOTER,
} from './index';

// Provides a line count for the provided string.
const getMultilineStringLineCount = (multilineString: string): number => {
   return multilineString.split(/\r\n|\r|\n/).length;
};

// Returns the first line of a multiline string.
const getFirstLineMultilineString = (multineString: string): string | undefined => {
   if (getMultilineStringLineCount(multineString) <= 0) {
      return multineString;
   }

   return multineString.split('\n').find((line) => { return line !== ''; });
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
};

/**
 * Runs auto-changelog with our custom options.
 *
 * @param isPrintOnly If set to true, the changelog will only be printed to the console.
 */
const run = async (isWritingToFile = false): Promise<void> => {
   const stat = promisify(fs.stat),
         writeFile = promisify(fs.writeFile),
         writeStream = fs.createWriteStream,
         changelogPath = `${process.cwd()}/${CHANGELOG_INFILE}`,
         changelogHeaderLineCount = getMultilineStringLineCount(CHANGELOG_HEADER);

   let isChangelogExisiting = false,
       existingChangelog = '',
       stream: fs.WriteStream,
       fileOutput: string[],
       output: string;

   // Check for the changelog file.
   try {
      await stat(changelogPath);
      isChangelogExisiting = true;
   } catch(error) {
      console.log(`Changelog ${changelogPath} not present, creating...`); // eslint-disable-line
   }

   if (!isChangelogExisiting) {
      try {
         // Create a write out the file with our template.
         await writeFile(
            changelogPath,
            `${CHANGELOG_HEADER}${CHANGELOG_FOOTER}`
         );
      } catch(error) {
         console.error('Error creating file:', error); // eslint-disable-line
      }
   }

   // Store the file contents in memory.
   existingChangelog = await readCurrentChangelog(changelogPath, changelogHeaderLineCount);

   // Get latest changelog.
   output = await executeShellCommand(await autoChangelogCommand(), 'Generating changelog');

   if (getFirstLineMultilineString(existingChangelog) === getFirstLineMultilineString(output)) {
      console.log('Most recent changelog:\n', output); // eslint-disable-line
      console.log('No new changes detected, exiting...'); // eslint-disable-line
      return;
   }

   if (isWritingToFile) {
      stream = writeStream(changelogPath, { encoding: 'utf8' });

      fileOutput = [
         CHANGELOG_HEADER,
         output,
         existingChangelog,
         CHANGELOG_FOOTER,
      ];

      stream.write(fileOutput.join('\n'));
   }

   console.log('Changelog generated!', output); // eslint-disable-line
};

export default run;
