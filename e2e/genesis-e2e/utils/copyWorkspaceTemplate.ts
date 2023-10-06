import {
  e2eTmpPath,
  ProgressIndicator,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";
import fs from "fs-extra";

export async function copyWorkspaceTemplate(name: string) {
  const destination = e2eTmpPath(name);
  let progressIndicator = new ProgressIndicator(
    `Removing ${destination}`,
  ).start();
  fs.rmSync(destination, { force: true, recursive: true });
  progressIndicator.succeed(`Removed ${destination}`);

  const templatePath = e2eTmpPath("genesis-e2e");
  progressIndicator = new ProgressIndicator(
    `Copying template from ${templatePath} to ${destination}`,
  );
  await fs.copy(templatePath, destination, {
    filter: skipNodeModules,
    recursive: true,
  });
  progressIndicator.succeed(
    `Copied template from ${templatePath} to ${destination}`,
  );

  const workspace = new TestingWorkspace(destination);

  await workspace.runPackageManagerInstall();

  return workspace;
}

function skipNodeModules(src: string, _dest: string) {
  return !src.includes("node_modules");
}
