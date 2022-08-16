import { tmpProjPath, uniq } from "@nrwl/nx-plugin/testing";
import { moveSync, removeSync } from "fs-extra";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

import { TestingWorkspace } from "../testingWorkspace";

interface TestingWorkspaceOptions {
  skipInstall?: boolean;
  skipGit?: boolean;
}

/**
 * Does essentially what ensureNxProject does, but creates the new workspace outside of the
 * current project and then moves it in. This is to ensure that we can get a full workspace
 * complete with features like a working git repo which are needed in order to test some of
 * our generators.
 */
export const createTestingWorkspace = async (
  workspaceName: string,
  npmPackageName: string,
  distPath: string,
  options: TestingWorkspaceOptions = {},
): Promise<TestingWorkspace> => {
  const destination = path.join(e2eRootPath(), workspaceName);
  removeSync(destination);

  const workspaceDirectory = createEmptyWorkspace(workspaceName, options);
  moveSync(workspaceDirectory, destination);

  const workspace = new TestingWorkspace(destination);

  workspace.patchPackageJsonForPlugin(npmPackageName, distPath);
  await workspace.runPackageManagerInstall();

  return workspace;
};

const createEmptyWorkspace = (
  workspaceName: string,
  options: TestingWorkspaceOptions,
) => {
  const { skipGit, skipInstall } = { skipInstall: true, ...options };

  const workspaceRoot = os.tmpdir();
  const tmpWorkspaceName = uniq(workspaceName);

  let command = `node ${require.resolve(
    "nx",
  )} new ${tmpWorkspaceName} --nx-workspace--root=${workspaceRoot} --no-interactive --collection=@nrwl/workspace --npmScope=proj --preset=empty`;

  if (skipGit) {
    command = `${command} --skip-git`;
  }

  if (skipInstall) {
    command = `${command} --skip-install`;
  }

  execSync(command, {
    cwd: workspaceRoot,
  });

  const workspaceDirectory = path.join(workspaceRoot, tmpWorkspaceName);
  return workspaceDirectory;
};

const e2eRootPath = () => {
  return path.join(tmpProjPath(), "..");
};
