import { getLatestCommitMessage } from "./getLatestCommitMessage";
import { getLatestCommitterEmail } from "./getLatestCommitterEmail";
import { getLatestCommitterName } from "./getLatestCommitterName";
import { getRepoRoot } from "./getRepoRoot";
import { isWorkingDirectoryClean } from "./isWorkingDirectoryClean";

export const GitUtils = {
  getLatestCommitterEmail,
  getLatestCommitMessage,
  getLatestCommitterName,
  getRepoRoot,
  isWorkingDirectoryClean,
};
