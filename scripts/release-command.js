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

function quitWithError(msg) {
   console.error(chalk.red.bold(`${msg}\n`));
   process.exit(1); // eslint-disable-line no-process-exit
}

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

      const changelogOptions = {
         preset: {
            name: 'conventionalcommits',
            issueUrlFormat: opts.issueUrlFormat,
         },
         skipUnstable: opts.ignorePrereleaseTags,
      };

      const context = { version: opts.version };

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
         if (content.trim().split('\n').length === 1) {
            resolve(undefined);
         }

         resolve(content);
      });
   });
}

async function addEntriesToChangelog(newEntries) {
   const existingChangelog = await (fs.promises.readFile(CHANGELOG_CONFIG.filename, 'utf-8').catch(() => { return ''; })),
         existingEntriesStartIndex = existingChangelog.search(CHANGELOG_CONFIG.releaseEntryPattern);

   let existingChangelogEntries = CHANGELOG_CONFIG.footer;

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

function createReleaseCommand({ cwd }) {
   // Synchronous read is intentional: the factory itself is sync and runs once at
   // command-construction time, not in a hot path.
   const packageJSON = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'))), // eslint-disable-line no-sync
         currentVersion = packageJSON.version,
         changelogConfig = packageJSON['silvermine-standardization'] ? packageJSON['silvermine-standardization'].changelog : {},
         prereleaseOption = new commander.Option('--prerelease <type>', 'The type of prerelease, e.g. alpha, beta, rc'),
         versionOption = new commander.Option('--version <version>', 'The version to use instead of the auto-calculated version');

   const noBranchOption = new commander.Option(
      '--no-branch',
      'Commit the changelog directly to the current branch instead of creating a `changelog-v<version>` branch'
   );

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

   const release = new commander.Command('release')
      .description('Release management commands');

   release.hook('preAction', async () => {
      if (await doesRepositoryHaveUncommittedChanges()) {
         quitWithError('The repository has uncommitted changes. Please ensure the repository is clean before running this script');
      }
   });

   release
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

   release
      .command('prep-changelog')
      .description('Generates the changelog for the next release')
      .addOption(prereleaseOption)
      .addOption(versionOption)
      .addOption(noBranchOption)
      .action(async (options) => {
         const targetVersion = await getNextVersion(options),
               isFinalVersion = !isPrereleaseVersion(targetVersion),
               useNewBranch = options.branch,
               changelogBranch = `changelog-v${targetVersion}`,
               pushTarget = useNewBranch ? changelogBranch : await getCurrentBranchName();

         console.info(`Generating changelog for ${packageJSON.name}@${targetVersion}...`);

         const changelogAdditions = await createChangelogAdditions({
            version: targetVersion,
            ignorePrereleaseTags: isFinalVersion,
            issueUrlFormat: changelogConfig.issueUrlFormat,
         });

         if (!changelogAdditions) {
            console.warn(chalk.yellow(
               'There were no changelog entries generated. Aborting changelog preparation.'
               + ' If this is expected (e.g. only documentation or internal changes were made),'
               + ' this version can be finalized without an update to the changelog.'
            ));
            return;
         }

         if (useNewBranch) {
            await createNewBranch(changelogBranch);
         } else {
            console.info(chalk.yellow(`Committing changelog directly to ${pushTarget}`));
         }

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

         const mrStep = useNewBranch ? `   ${chalk.gray('3.')} Create a merge request\n` : '';

         console.info(
            chalk.whiteBright('The changelog has been updated. Please do the following:\n\n')
            + `   ${chalk.gray('1.')} git show ${chalk.gray('# and review the changes')}\n`
            + `   ${chalk.gray('2.')} git push $REMOTE_NAME ${pushTarget}\n`
            + mrStep
         );
      });

   release
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

   return release;
}

module.exports = { createReleaseCommand };
