import { tmpProjPath, uniq } from "@nrwl/nx-plugin/testing";
import { ensureDirSync, moveSync, removeSync } from "fs-extra";
import os from "node:os";
import path from "node:path";

import { TestingWorkspace } from "../testingWorkspace";
import { Verdaccio } from "../verdaccio";

export const createGenesisWorkspace = (
  workspaceScope: string,
  workspaceName: string,
  verdaccioUrl = "http://localhost:4873",
) => {
  const verdaccio = new Verdaccio(verdaccioUrl);

  const distPackagesDir = path.join(__dirname, "../../../../dist/packages");

  verdaccio.publish(path.join(distPackagesDir, "genesis"));
  verdaccio.publish(path.join(distPackagesDir, "nx-plugin"));

  const tmpDir = path.join(os.tmpdir(), uniq(workspaceName));
  ensureDirSync(tmpDir);

  verdaccio.npx(
    `genesis --workspace-scope=${workspaceScope} --workspace-name=${workspaceName} --description="Test repo for genesis CLI E2E tests" --skip-github --registry=${verdaccio.getUrl()}`,
    tmpDir,
  );

  const tmpDestination = path.join(tmpDir, workspaceName);
  const destination = path.join(tmpProjPath(), "..", workspaceName);

  removeSync(destination);
  moveSync(tmpDestination, destination);

  return new TestingWorkspace(destination);
};
