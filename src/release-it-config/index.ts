import {
   IRepositoryReleaseSettings,
   IReleaseItOptions,
} from './interfaces';
import path from 'path';
import process from 'process';

const RELEASE_VERSION_NAME = 'release v${version}';

const CHANGELOG_INFILE = process.cwd() + '/CHANGELOG.md';

const REPOSITORY_RELEASE_SETTINGS: IRepositoryReleaseSettings = {};

const LATEST_VALID_TAG_COMMAND = 'git describe --exclude "*rc*" --abbrev=0';

const RELEASE_NOTES_COMMAND: string | boolean = `
  git log --grep=fix: --grep=feat: --no-merges --pretty=format:"* %s (%h)" $(${LATEST_VALID_TAG_COMMAND})...HEAD
`;

const CHANGELOG_HEADER =
`# Changelog

All notable changes to this project will be documented in this file.
See [our coding standards][commit-messages] for commit guidelines.
`;

const CHANGELOG_FOOTER =
`[commit-messages]: https://github.com/silvermine/silvermine-info/blob/master/commit-history.md#commit-messages
`;

const AUTOCHANGELOG_TEMPLATE_PATH = `${path.resolve(__dirname)}/auto-changelog/templates/template.hbs`;

// Auto-changlog command with options
const AUTOCHANGELOG_COMMAND = [
   'npx',
   'auto-changelog',
   '-p',
   '--commit-limit false',
   `--template ${AUTOCHANGELOG_TEMPLATE_PATH}`,
   `--output ${CHANGELOG_INFILE}`,
   '--unreleased-only',
   // Pass latest tag to get correct changeset
   `--latest-version $(${LATEST_VALID_TAG_COMMAND})`,
   '--stdout',
]
   .join(' ');

REPOSITORY_RELEASE_SETTINGS.release = true;
REPOSITORY_RELEASE_SETTINGS.releaseName = 'Release ${tagName}';
REPOSITORY_RELEASE_SETTINGS.releaseNotes = RELEASE_NOTES_COMMAND;

const config: IReleaseItOptions = {
   plugins: {
      '@release-it/conventional-changelog': {
         preset: 'conventionalcommits',
      },
   },
   git: {
      push: false,
      tag: false,
      tagName: 'v${version}',
      tagAnnotation: RELEASE_VERSION_NAME,
      commitMessage: 'chore: ' + RELEASE_VERSION_NAME,
      // This uses the auto-changelog command to generate report changelogs
      // in the CLI output
      changelog: AUTOCHANGELOG_COMMAND,
      requireUpstream: false,
   },
   npm: {
      publish: false,
   },
   gitHub: REPOSITORY_RELEASE_SETTINGS,
   gitLab: REPOSITORY_RELEASE_SETTINGS
};

export {
   AUTOCHANGELOG_COMMAND,
   CHANGELOG_INFILE,
   CHANGELOG_HEADER,
   CHANGELOG_FOOTER
};

export default config;
