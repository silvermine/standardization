import { autoChangelogCommand } from './auto-changelog-config';

// Shared variables used by various configurations.
const LATEST_VALID_TAG_COMMAND = 'git describe --exclude "*rc*" --abbrev=0';

const CHANGELOG_INFILE = 'CHANGELOG.md';

export {
   autoChangelogCommand,
   CHANGELOG_INFILE,
   LATEST_VALID_TAG_COMMAND,
};
