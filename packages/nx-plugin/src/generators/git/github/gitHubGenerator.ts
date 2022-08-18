import { Tree } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../../logger";
import { exec, github } from "../../../utils";
import { noOpTask } from "../../tasks";
import { GitHubGeneratorSchema } from "./gitHubGenerator.schema";

export function gitHubGenerator(tree: Tree, options: GitHubGeneratorSchema) {
  logger.info(
    `Generating GitHub repository with options:\n${JSON.stringify(
      options,
      undefined,
      2,
    )}`,
  );

  const createOrUpdateRepoTask = createOrUpdateRepo(options);
  const addGitRemoteTask = addGitRemote(tree, options);
  const pushToRemoteMasterTask = pushToRemoteMaster(tree, options);
  const protectMasterBranchTask = protectMasterBranch(options);

  return async () => {
    logger.info("Running post-processing tasks for GitHub generator");

    await createOrUpdateRepoTask();
    await addGitRemoteTask();
    await pushToRemoteMasterTask();
    await protectMasterBranchTask();
    // TODO: Create / update labels
  };
}

function createOrUpdateRepo({
  organization,
  repositoryName,
  repositoryDescription,
  privateRepository,
}: GitHubGeneratorSchema) {
  return async () => {
    logger.info(
      `Creating or updating GitHub repo ${organization}/${repositoryName}`,
    );

    await github.createOrUpdateRepo({
      owner: organization,
      name: repositoryName,
      description: repositoryDescription,
      isPrivate: privateRepository,
      allowAutoMerge: true,
      allowMergeCommit: false,
      allowRebaseMerge: true,
      allowSquashMerge: true,
      allowUpdateBranch: true,
      deleteBranchOnMerge: true,
      hasIssues: true,
    });
  };
}

function protectMasterBranch({
  organization,
  repositoryName,
  enableCircleCiStatusChecks,
  enableCodecovStatusChecks,
}: GitHubGeneratorSchema) {
  const requiredStatusChecks: string[] = [];

  if (enableCircleCiStatusChecks) {
    requiredStatusChecks.push("lint-build-test-deploy");
  }

  if (enableCodecovStatusChecks) {
    requiredStatusChecks.push("codecov/patch", "codecov/project");
  }

  return async () => {
    logger.info("Updating GitHub master branch protections");

    await github.updateBranchProtection({
      repoOwner: organization,
      repoName: repositoryName,
      branch: "master",
      requiredStatusChecks,
      requiredStatusChecksStrict: true,
      requiredApprovingReviewCount: 0,
      requiredLinearHistory: true,
      allowForcePushes: false,
      allowDeletions: false,
      requiredConversationResolution: true,
      enforceAdmins: false,
    });
  };
}

function pushToRemoteMaster(tree: Tree, options: GitHubGeneratorSchema) {
  const { pushToRemote, forcePush } = options;

  if (!pushToRemote) {
    return noOpTask;
  }

  return async () => {
    logger.info("Pushing all code to remote origin master");

    let command = "git push -u origin master";

    if (forcePush) {
      command = `${command} -f`;
    }

    await exec(command, {
      cwd: tree.root,
    });
  };
}

function addGitRemote(
  tree: Tree,
  { organization, repositoryName }: GitHubGeneratorSchema,
) {
  const gitUrl = `git@github.com:${organization}/${repositoryName}.git`;

  logger.info(`Adding git remote origin with URL ${gitUrl}`);

  return async () => {
    await exec(`git remote add origin ${gitUrl}`, {
      cwd: tree.root,
    });
  };
}
