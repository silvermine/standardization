import path from 'path';
import {
   CHANGELOG_INFILE,
   LATEST_VALID_TAG,
} from '../index';

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
   `--latest-version ${LATEST_VALID_TAG}`,
   '--stdout',
]
   .join(' ');

export {
   AUTOCHANGELOG_COMMAND,
   CHANGELOG_HEADER,
   CHANGELOG_FOOTER,
};
