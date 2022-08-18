import { readJsonFile, Tree } from "@nrwl/devkit";
import fs from "node:fs";
import path from "node:path";

import { generatorLogger as logger } from "../../../../logger";
import { exec, github } from "../../../../utils";

type LabelMigrationAction =
  | CreateLabelAction
  | UpdateLabelAction
  | DeleteLabelAction;

interface CreateLabelAction {
  action: LabelAction.Create;
  name: string;
  description: string;
  color: string;
}

interface UpdateLabelAction {
  action: LabelAction.Update;
  name: string;
  payload: {
    name?: string;
    description?: string;
    color?: string;
  };
}

interface DeleteLabelAction {
  action: LabelAction.Delete;
  name: string;
}

enum LabelAction {
  Create = "CREATE",
  Update = "UPDATE",
  Delete = "DELETE",
}

export function gitHubLabelsGenerator(tree: Tree) {
  logger.info("Updating labels for GitHub repository");

  const applyLabelMigrationsTask = applyLabelMigrations(tree);

  return async () => {
    logger.info(
      "Running post-processing jobs to update labels for GitHub repository",
    );
    await applyLabelMigrationsTask();
  };
}

function applyLabelMigrations(tree: Tree) {
  const migrationsDir = path.join(__dirname, "./migrations");
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const migrationFileNames = fs.readdirSync(migrationsDir, "ascii");

  const migrationFilePaths = migrationFileNames.map((fileName: string) => {
    return path.join(migrationsDir, fileName);
  });
  migrationFilePaths.sort();

  return async () => {
    const { organization, repositoryName } = await getGitHubRepoInfo(tree);

    logger.info(
      `Applying ${migrationFilePaths.length} label migrations to ${organization}/${repositoryName}`,
    );

    for (const migrationFilePath of migrationFilePaths) {
      logger.debug(`Running migrations from ${migrationFilePath}`);

      const actions = readJsonFile<LabelMigrationAction[]>(migrationFilePath);
      for (const action of actions) {
        await processLabelMigrationAction(action, organization, repositoryName);
      }
    }
  };
}

async function getGitHubRepoInfo(tree: Tree) {
  const remoteName = "origin";
  const { stdout } = await exec(`git config --get remote.${remoteName}.url`, {
    cwd: tree.root,
  });

  const remoteUrl = stdout.trim();

  return parseRemoteUrl(remoteUrl);
}

async function processLabelMigrationAction(
  action: LabelMigrationAction,
  organization: string,
  repositoryName: string,
) {
  logger.debug(
    `Running label migration action:\n${JSON.stringify(action, undefined, 2)}`,
  );

  switch (action.action) {
    case LabelAction.Create: {
      await github.createOrUpdateLabel({
        repoOwner: organization,
        repoName: repositoryName,
        ...action,
      });
      return;
    }
    case LabelAction.Update: {
      await updateLabel(action, organization, repositoryName);
    }
    case LabelAction.Delete: {
      await github.deleteLabel(organization, repositoryName, action.name);
      return;
    }
    default: {
      throw new Error(
        `Received unrecognized label migration action ${
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (action as any).action as string
        }`,
      );
    }
  }
}

async function updateLabel(
  action: UpdateLabelAction,
  organization: string,
  repositoryName: string,
) {
  const { name: originalLabelName, payload } = action;

  const originalLabelExists = await github.labelExists(
    organization,
    repositoryName,
    originalLabelName,
  );

  if (!originalLabelExists) {
    return;
  }

  let updatedLabelExists = false;
  const updatedLabelName = payload.name;

  if (updatedLabelName) {
    updatedLabelExists = await github.labelExists(
      organization,
      repositoryName,
      updatedLabelName,
    );
  }

  let targetLabelName = originalLabelName;

  if (updatedLabelExists) {
    await github.deleteLabel(organization, repositoryName, originalLabelName);
    targetLabelName = updatedLabelName as string;
  }

  await github.updateLabel({
    repoOwner: organization,
    repoName: repositoryName,
    originalName: targetLabelName,
    ...payload,
  });
}

export function parseRemoteUrl(remoteUrl: string) {
  const colonIndex = remoteUrl.indexOf(":");
  const orgAndRepoPlusSuffix = remoteUrl.slice(colonIndex + 1);

  const suffixIndex = orgAndRepoPlusSuffix.lastIndexOf(".git");
  const orgAndRepo = orgAndRepoPlusSuffix.slice(0, suffixIndex);

  const slashIndex = orgAndRepo.lastIndexOf("/");
  const organization = orgAndRepo.slice(0, slashIndex);
  const repositoryName = orgAndRepo.slice(slashIndex + 1);

  return {
    organization,
    repositoryName,
  };
}
