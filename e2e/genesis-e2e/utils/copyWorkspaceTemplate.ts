import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import fs from "fs-extra";
import ora from "ora";

export async function copyWorkspaceTemplate(name: string) {
  const destination = e2eTmpPath(name);
  let spinner = ora(`Removing ${destination}`).start();
  fs.rmSync(destination, { force: true, recursive: true });
  spinner.succeed(`Removed ${destination}`);

  const templatePath = e2eTmpPath("genesis-e2e");
  spinner = ora(`Copying template from ${templatePath} to ${destination}`);
  await fs.copy(templatePath, destination, {
    filter: skipNodeModules,
    recursive: true,
  });
  spinner.succeed(`Copied template from ${templatePath} to ${destination}`);

  const workspace = new TestingWorkspace(destination);

  await workspace.runPackageManagerInstall();

  return workspace;
}

function skipNodeModules(src: string, _dest: string) {
  return !src.includes("node_modules");
}
