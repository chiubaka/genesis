import { workspaceRoot } from "@nrwl/devkit";
import path from "node:path";

import { exec } from "../../utils";
import {
  LocalPublishExecutorSchema,
  RegistryCredentials,
} from "./localPublishExecutor.schema";

export async function localPublishExecutor(
  options: LocalPublishExecutorSchema,
) {
  const { registryUrl, registryCredentials, packagePath } = options;

  await login(registryUrl, registryCredentials);
  await publish(registryUrl, packagePath);

  return {
    success: true,
  };
}

function login(registryUrl: string, credentials: RegistryCredentials) {
  const { username, password, email } = credentials;

  return exec(
    `npx npm-cli-login -r ${registryUrl} -u ${username} -p ${password} -e ${email}`,
  );
}

async function publish(registryUrl: string, relativePackagePath: string) {
  const packagePath = path.join(workspaceRoot, relativePackagePath);

  await exec(`npm unpublish --force --registry=${registryUrl}`, {
    cwd: packagePath,
  });

  await exec(`npm publish --registry=${registryUrl}`, {
    cwd: packagePath,
  });
}
