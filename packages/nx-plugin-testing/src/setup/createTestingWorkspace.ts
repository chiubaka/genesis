import { tmpProjPath, uniq } from "@nx/plugin/testing";
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
 * @param workspaceName
 * @param npmPackageName
 * @param distPath
 * @param options
 */
export const createTestingWorkspace = async (
  workspaceName: string,
  npmPackageName: string,
  distPath: string,
  options: TestingWorkspaceOptions = {},
): Promise<TestingWorkspace> => {
  const destination = path.join(e2eRootPath(), workspaceName);
  removeSync(destination);

  const workspaceDirectory = await createEmptyWorkspace(workspaceName, options);

  moveSync(workspaceDirectory, destination);

  const workspace = new TestingWorkspace(destination);

  workspace.patchPackageJsonForPlugin(npmPackageName, distPath);
  await workspace.runPackageManagerInstall();

  return workspace;
};

const createEmptyWorkspace = async (
  workspaceName: string,
  options: TestingWorkspaceOptions,
) => {
  const { skipGit, skipInstall } = { skipInstall: true, ...options };

  const workspaceRoot = os.tmpdir();
  const tmpWorkspaceName = uniq(workspaceName);

  // We use @nx/workspace:new generator instead of create-nx-workspace because invoking the
  // new generator directly gives us more flexibility on workspace initialization
  // However, this does make things a bit more brittle, since we depend on Nx internals
  // that may change without warning. (See https://github.com/chiubaka/genesis/issues/141)
  let command = `node ${require.resolve(
    "nx",
  )} new ${tmpWorkspaceName} --nx-workspace-root=${workspaceRoot} --no-interactive --collection=@nx/workspace --npmScope=proj --preset=apps`;

  if (skipInstall) {
    command = `${command} --skip-install`;
  }

  execSync(command, {
    cwd: workspaceRoot,
  });

  const workspaceDirectory = path.join(workspaceRoot, tmpWorkspaceName);

  const tmpWorkspace = new TestingWorkspace(workspaceDirectory);

  if (!skipGit) {
    // Manual git generation is required if using @nx/workspace:new after Nx v14.6.0
    // https://github.com/nrwl/nx/releases/tag/14.6.0
    await tmpWorkspace.git.init();
    await tmpWorkspace.git.commitAllFiles(
      "Add files generated by @nx/workspace:new generator with empty preset",
    );
  }

  return workspaceDirectory;
};

const e2eRootPath = () => {
  return path.join(tmpProjPath(), "..");
};
