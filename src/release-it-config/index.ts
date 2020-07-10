import {
   IRepositoryReleaseSettings,
   IReleaseItOptions,
} from './interfaces';
import process from 'process';
import {
   AUTOCHANGELOG_COMMAND,
   LATEST_VALID_TAG_COMMAND,
} from '../index';

const RELEASE_VERSION_NAME = 'release v${version}';

const CHANGELOG_INFILE = process.cwd() + '/CHANGELOG.md';

const REPOSITORY_RELEASE_SETTINGS: IRepositoryReleaseSettings = {};

const RELEASE_NOTES_COMMAND: string | boolean = `
  git log --grep=fix: --grep=feat: --no-merges --pretty=format:"* %s (%h)" $(${LATEST_VALID_TAG_COMMAND})...HEAD
`;

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
   gitLab: REPOSITORY_RELEASE_SETTINGS,
};

export {
   CHANGELOG_INFILE,
   LATEST_VALID_TAG_COMMAND,
};

export default config;
