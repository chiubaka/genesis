import {
  cleanup,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
  tmpProjPath,
  uniq,
} from "@nrwl/nx-plugin/testing";
import { moveSync } from "fs-extra";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

/**
 * Does essentially what ensureNxProject does, but creates the new workspace outside of the
 * current project and then moves it in. This is to ensure that we can get a full workspace
 * complete with features like a working git repo which are needed in order to test some of
 * our generators.
 */
export const createTestingWorkspace = (
  npmPackageName: string,
  distPath: string,
) => {
  cleanup();
  const workspaceDirectory = createEmptyWorkspace();
  moveWorkspaceToE2eTmpDir(workspaceDirectory);
  patchPackageJsonForPlugin(npmPackageName, distPath);
  runPackageManagerInstall();
};

const createEmptyWorkspace = () => {
  const workspaceRoot = os.tmpdir();
  const workspaceName = uniq("proj");

  execSync(
    `node ${require.resolve(
      "nx",
    )} new ${workspaceName} --nx-workspace--root=${workspaceRoot} --no-interactive --skip-install --collection=@nrwl/workspace --npmScope=proj --preset=empty`,
    {
      cwd: workspaceRoot,
    },
  );

  const workspaceDirectory = path.join(workspaceRoot, workspaceName);
  return workspaceDirectory;
};

const moveWorkspaceToE2eTmpDir = (workspaceDirectory: string) => {
  moveSync(workspaceDirectory, tmpProjPath());
};
