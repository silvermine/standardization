import getLatestValidTag from './utilities/get-latest-valid-tag';
import { AUTOCHANGELOG_COMMAND } from './auto-changelog-config';
import { CHANGELOG_INFILE } from './release-it-config';

// Shared variables used by various configurations.
const LATEST_VALID_TAG_COMMAND = 'git describe --exclude "*rc*" --abbrev=0';

const LATEST_VALID_TAG = getLatestValidTag();

export {
   AUTOCHANGELOG_COMMAND,
   CHANGELOG_INFILE,
   LATEST_VALID_TAG_COMMAND,
   LATEST_VALID_TAG,
};
