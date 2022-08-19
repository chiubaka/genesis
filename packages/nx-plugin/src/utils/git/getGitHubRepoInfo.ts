import { Tree } from "@nrwl/devkit";

import { exec } from "../exec";
import { parseRemoteUrl } from "./parseRemoteUrl";

export async function getGitHubRepoInfo(tree: Tree) {
  const remoteName = "origin";
  const { stdout } = await exec(`git config --get remote.${remoteName}.url`, {
    cwd: tree.root,
  });

  const remoteUrl = stdout.trim();

  return parseRemoteUrl(remoteUrl);
}
