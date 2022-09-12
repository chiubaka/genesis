import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import fs from "fs-extra";

export async function copyWorkspaceTemplate(name: string) {
  const destination = e2eTmpPath(name);
  fs.rmSync(destination, { force: true, recursive: true });

  await fs.copy(e2eTmpPath("genesis-e2e"), destination, {
    filter: skipNodeModules,
    recursive: true,
  });

  const workspace = new TestingWorkspace(destination);

  await workspace.runPackageManagerInstall();

  return workspace;
}

function skipNodeModules(src: string, _dest: string) {
  return !src.includes("node_modules");
}
