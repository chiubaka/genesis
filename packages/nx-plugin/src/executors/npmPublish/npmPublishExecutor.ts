import { workspaceRoot } from "@nrwl/devkit";
import path from "node:path";

import { exec } from "../../utils";
import {
  NpmPublishExecutorSchema,
  RegistryCredentials,
} from "./npmPublishExecutor.schema";

export async function npmPublishExecutor(options: NpmPublishExecutorSchema) {
  const {
    access,
    dryRun,
    registryUrl,
    registryCredentials,
    packagePath: relativePackagePath,
    skipLogin,
    skipUnpublish,
  } = options;

  const packagePath = path.join(workspaceRoot, relativePackagePath);

  if (!skipLogin && registryCredentials) {
    await login(registryUrl, registryCredentials);
  }

  if (!skipUnpublish) {
    await unpublish(registryUrl, packagePath, dryRun);
  }

  await publish(registryUrl, packagePath, access, dryRun);

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

async function unpublish(
  registryUrl: string,
  packagePath: string,
  dryRun: boolean,
) {
  await exec(
    `npm unpublish --force --registry=${registryUrl} --dry-run=${dryRun}`,
    {
      cwd: packagePath,
    },
  );
}

async function publish(
  registryUrl: string,
  packagePath: string,
  access: "restricted" | "public",
  dryRun: boolean,
) {
  await exec(
    `npm publish --registry=${registryUrl} --access=${access} --dry-run=${dryRun}`,
    {
      cwd: packagePath,
    },
  );
}
