/* eslint no-console: [ "error", { allow: [ "info", "warn", "error" ] } ] */
'use strict';

const commander = require('commander'),
      chalk = require('chalk'),
      conventionalChangelog = require('conventional-changelog'),
      conventionalRecommendedBump = require('conventional-recommended-bump'),
      semver = require('semver'),
      fs = require('fs'),
      path = require('path'),
      childProcess = require('child_process'),
      util = require('util'),
      gitSemverTags = util.promisify(require('git-semver-tags')),
      getRecommendedBump = util.promisify(conventionalRecommendedBump),
      execFile = util.promisify(childProcess.execFile);

const CHANGELOG_CONFIG = {
   filename: 'CHANGELOG.md',
   releaseEntryPattern: /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m,
   header: '# Changelog\n\nAll notable changes to this project will be documented in this file.\n'
      + 'See [our coding standards][commit-messages] for commit guidelines.\n\n',
   footer: '[commit-messages]: https://github.com/silvermine/silvermine-info/blob/master/commit-history.md#commit-messages',
};

function isPrereleaseVersion(version) {
   return !!semver.prerelease(version);
}

async function calculateNextVersion(currentVersion, prereleaseIdentifier) {
   const recommendedBump = await getRecommendedBump({
      preset: {
         name: 'conventionalcommits',
         preMajor: semver.lt(currentVersion, '1.0.0'),
      },
   });

   let releaseType = recommendedBump.releaseType;

   if (prereleaseIdentifier) {
      if (isPrereleaseVersion(currentVersion)) {
         // TODO: We might need to consider adjusting this to support bumping to the next
         // version (e.g. a patch prerelease contains a new feature)
         // See: https://github.com/conventional-changelog/standard-version/blob/6c75ed0b14f/lib/lifecycles/bump.js#L46-L50
         releaseType = 'prerelease';
      } else {
         releaseType = `pre${releaseType}`; // e.g. premajor, preminor, prepatch
      }
   }

   return semver.inc(currentVersion, releaseType, prereleaseIdentifier);
}

/**
 * Returns the last, based on semver ordering, final release tag (i.e. v1.0.0, not
 * v1.0.0-rc.0) found in the git log for the current branch.
 */
async function getLastFinalReleaseTag() {
   const semverTags = await gitSemverTags({
      skipUnstable: true,
   });

   return semverTags.length ? semver.rsort(semverTags)[0] : undefined;
}

function createChangelogAdditions(opts) {
   return new Promise((resolve, reject) => {
      let content = '';

      // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-core#options
      const changelogOptions = {
         preset: {
            name: 'conventionalcommits',
            issueUrlFormat: opts.issueUrlFormat,
         },
         skipUnstable: opts.ignorePrereleaseTags,
      };

      // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#context
      const context = { version: opts.version };

      // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer#options
      const writerOptions = {
         generateOn: (commit) => {
            if (opts.ignorePrereleaseTags && isPrereleaseVersion(commit.version)) {
               return false;
            }

            return semver.valid(commit.version);
         },
      };

      const changelogStream = conventionalChangelog(changelogOptions, context, undefined, undefined, writerOptions);

      changelogStream.on('error', (err) => {
         return reject(err);
      });

      changelogStream.on('data', (buffer) => {
         content += buffer.toString();
      });

      changelogStream.on('end', () => {
         // In the event the there are no entries added to the changelog (i.e. it's just a
         // changelog header), we add a line acknowledging this release only contains
         // documentation or internal changes.
         if (content.trim().split('\n').length === 1) {
            content += '_This release only contains documentation or internal changes._\n\n';
         }

         resolve(content);
      });
   });
}

async function addEntriesToChangelog(newEntries) {
   const existingChangelog = await (fs.promises.readFile(CHANGELOG_CONFIG.filename, 'utf-8').catch(() => { return ''; })),
         existingEntriesStartIndex = existingChangelog.search(CHANGELOG_CONFIG.releaseEntryPattern);

   let existingChangelogEntries = CHANGELOG_CONFIG.footer; // NOTE: Only added when creating a new changelog

   if (existingEntriesStartIndex !== -1) {
      existingChangelogEntries = existingChangelog.substring(existingEntriesStartIndex);
   }

   const newChangelog = `${CHANGELOG_CONFIG.header}${newEntries}\n${existingChangelogEntries}`;

   await fs.promises.writeFile(CHANGELOG_CONFIG.filename, newChangelog.trimEnd() + '\n');
}

async function createNewBranch(name) {
   await execFile('git', [ 'checkout', '-b', name ]);
}

async function resetChangelogToTag(tag) {
   await execFile('git', [ 'checkout', tag, '--', CHANGELOG_CONFIG.filename ]);
}

async function commitChangelog(version) {
   await execFile('git', [ 'add', CHANGELOG_CONFIG.filename ]);
   await execFile('git', [ 'commit', '-m', `chore: update changelog for v${version}` ]);
}

async function getCurrentBranchName() {
   const output = await execFile('git', [ 'rev-parse', '--abbrev-ref', 'HEAD' ]);

   return output.stdout.trim();
}

async function doesRepositoryHaveUncommittedChanges() {
   const output = await execFile('git', [
      'status',
      '--porcelain',
   ]);

   return output.stdout !== '';
}

const main = async (argv) => {
   function quitWithError(msg) {
      console.error(chalk.red.bold(`${msg}\n`));
      process.exit(1); // eslint-disable-line no-process-exit
   }

   if (await doesRepositoryHaveUncommittedChanges()) {
      quitWithError('The repository has uncommitted changes. Please ensure the repository is clean before running this script');
   }

   const program = new commander.Command(),
         packageJSON = JSON.parse(await fs.promises.readFile(path.join(process.cwd(), 'package.json'))),
         currentVersion = packageJSON.version,
         changelogConfig = packageJSON['silvermine-standardization'] ? packageJSON['silvermine-standardization'].changelog : {},
         prereleaseOption = new commander.Option('--prerelease <type>', 'The type of prerelease, e.g. alpha, beta, rc'),
         versionOption = new commander.Option('--version <version>', 'The version to use instead of the auto-calculated version');

   async function getNextVersion(options) {
      if (options.version) {
         const providedVersion = semver.clean(options.version);

         if (!providedVersion) {
            quitWithError(`Invalid version: ${options.version}`);
         }

         if (options.prerelease) {
            quitWithError(
               'The --prerelease flag cannot be used with --version.'
               + ` Please specify the desired prerelease in the version, e.g. ${providedVersion}-${options.prerelease}.0`
            );
         }

         return providedVersion;
      }

      return await calculateNextVersion(currentVersion, options.prerelease);
   }

   program
      .command('preview')
      .description('Preview the version and changelog for the next release')
      .addOption(prereleaseOption)
      .addOption(versionOption)
      .action(async (options) => {
         const targetVersion = await getNextVersion(options);

         console.info(chalk.yellow(`Will bump ${packageJSON.name} from v${currentVersion} to v${targetVersion}`));
         console.info(chalk.whiteBright('\nAutogenerated changelog:\n'));
         console.info(await createChangelogAdditions({
            version: targetVersion,
            ignorePrereleaseTags: !isPrereleaseVersion(targetVersion),
            issueUrlFormat: changelogConfig.issueUrlFormat,
         }));
      });

   program
      .command('prep-changelog')
      .description('Generates the changelog for the next release')
      .addOption(prereleaseOption)
      .addOption(versionOption)
      .action(async (options) => {
         const targetVersion = await getNextVersion(options),
               isFinalVersion = !isPrereleaseVersion(targetVersion),
               changelogBranch = `changelog-v${targetVersion}`;

         console.info(`Generating changelog for ${packageJSON.name}@${targetVersion}...`);

         const changelogAdditions = await createChangelogAdditions({
            version: targetVersion,
            ignorePrereleaseTags: isFinalVersion,
            issueUrlFormat: changelogConfig.issueUrlFormat,
         });

         if (!changelogAdditions) {
            console.warn(chalk.yellow('There were no changelog entries generated. Aborting changelog preparation.'));
            return;
         }

         await createNewBranch(changelogBranch);

         if (isFinalVersion && semver.diff(currentVersion, targetVersion) === 'prerelease') {
            const lastFinalReleaseTag = await getLastFinalReleaseTag();

            if (lastFinalReleaseTag) {
               console.info(chalk.yellow(`Resetting changelog to ${lastFinalReleaseTag} to remove prerelease entries...`));
               await resetChangelogToTag(lastFinalReleaseTag);
            } else {
               console.info(chalk.red(
                  'Could not find a tag for a non-prerelease version. Not resetting the changelog to remove prerelease entries.'
               ));
            }
         }

         await addEntriesToChangelog(changelogAdditions);

         await commitChangelog(targetVersion);

         console.info(
            chalk.whiteBright('The changelog has been updated. Please do the following:\n\n')
            + `   ${chalk.gray('1.')} git show ${chalk.gray('# and review the changes')}\n`
            + `   ${chalk.gray('2.')} git push $REMOTE_NAME ${changelogBranch}\n`
            + `   ${chalk.gray('3.')} Create a merge request\n`
         );
      });

   program
      .command('finalize')
      .description('Performs the version bump for the release')
      .addOption(prereleaseOption)
      .addOption(versionOption)
      .action(async (options) => {
         const targetVersion = await getNextVersion(options),
               currentBranch = await getCurrentBranchName();

         console.info(`Bumping ${packageJSON.name} from v${currentVersion} to v${targetVersion}...`);

         await execFile('npm', [
            'version',
            // `--allow-same-version` makes it so it's possible to have an initial release
            // where the current version equals the target version
            '--allow-same-version',
            targetVersion,
            '-m',
            `chore: version bump: v${targetVersion}`,
         ]);

         console.info(
            chalk.whiteBright('The package version has been bumped. Please do the following:\n\n')
            + `   ${chalk.gray('1.')} git show ${chalk.gray('# and review the changes')}\n`
            + `   ${chalk.gray('2.')} git push $REMOTE_NAME ${currentBranch} v${targetVersion}\n`
            + `   ${chalk.gray('3.')} If the package needs to be manually published, run "npm publish"\n`
         );
      });

   program.action(() => { program.outputHelp(); });
   program.exitOverride();

   try {
      await program.parseAsync(argv);
   } catch(err) {
      if (err instanceof commander.CommanderError) {
         program.outputHelp();
      } else {
         console.error(chalk.red.bold(`ERROR: ${err}`) + `\n${err.stack}`);
      }

      process.exit(1); // eslint-disable-line no-process-exit
   }
};

main(process.argv);
