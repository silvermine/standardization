import executeShellCommand from './execute-shell-command';
import { LATEST_VALID_TAG_COMMAND } from '../release-it-config';

/**
 * Resolves our latest "valid" tag, that is, the latest
 * tag that is not from a release candidate release.
 */
export default async (): Promise<string> => {
   return await executeShellCommand(LATEST_VALID_TAG_COMMAND, 'Getting latest valid git tag');
};
