import {
   IRepositoryReleaseSettings,
   IReleaseItOptions,
} from './interfaces';
import path from 'path';

const RELEASE_VERSION_NAME = 'release v${version}',
      CHANGELOG_PATTERN: string | boolean = 'git log --pretty=format:"* %s (%h)" $(git describe --exclude "*rc*" --abbrev=0)...HEAD',
      CHANGELOG_INFILE = 'CHANGELOG.md',
      REPOSITORY_RELEASE_SETTINGS: IRepositoryReleaseSettings = {};

REPOSITORY_RELEASE_SETTINGS.release = true;
REPOSITORY_RELEASE_SETTINGS.releaseName = 'Release ${tagName}';
REPOSITORY_RELEASE_SETTINGS.releaseNotes = CHANGELOG_PATTERN;

export default {
   plugins: {
      '@release-it/conventional-changelog': {
         preset: 'conventionalcommits',
         infile: CHANGELOG_INFILE,
      },
      // If these paths change, we should make sure that the Grunt.js configuration
      // is also updated. See: `config.out.releaseIt.plugins` in Gruntfile.js
      [path.resolve(__dirname) + '/plugins/pause-for-changelog.js']: {
         infile: CHANGELOG_INFILE,
      },
   },
   git: {
      push: false,
      tag: false,
      tagName: 'v${version}',
      tagAnnotation: RELEASE_VERSION_NAME,
      commitMessage: 'chore: ' + RELEASE_VERSION_NAME,
      changelog: CHANGELOG_PATTERN,
      requireUpstream: false,
   },
   npm: {
      publish: false,
   },
   gitHub: REPOSITORY_RELEASE_SETTINGS,
   gitLab: REPOSITORY_RELEASE_SETTINGS,
} as IReleaseItOptions;
