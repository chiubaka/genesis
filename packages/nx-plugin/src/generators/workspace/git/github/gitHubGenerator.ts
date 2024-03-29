import { Tree, updateJson } from "@nx/devkit";

import { generatorLogger as logger } from "../../../../logger";
import { PackageJson } from "../../../../types";
import { exec, github, noOpTask } from "../../../../utils";
import { gitHubBranchProtectionGenerator } from "./branchProtection";
import { GitHubGeneratorSchema } from "./gitHubGenerator.schema";
import { gitHubLabelsGenerator } from "./labels";

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
  updatePackageJson(tree, options);
  const pushToRemoteMasterTask = pushToRemoteMaster(tree, options);
  const protectBranchesTask = gitHubBranchProtectionGenerator(tree, options);
  const updateLabelsTask = gitHubLabelsGenerator(tree);

  return async () => {
    logger.info("Running post-processing tasks for GitHub generator");

    await createOrUpdateRepoTask();
    await addGitRemoteTask();
    await pushToRemoteMasterTask();
    await protectBranchesTask();
    await updateLabelsTask();
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

function addGitRemote(tree: Tree, options: GitHubGeneratorSchema) {
  const { organization, repositoryName } = options;
  const gitUrl = `git@github.com:${organization}/${repositoryName}.git`;

  logger.info(`Adding git remote origin with URL ${gitUrl}`);

  return async () => {
    await exec(`git remote add origin ${gitUrl}`, {
      cwd: tree.root,
    });
  };
}

function updatePackageJson(tree: Tree, options: GitHubGeneratorSchema) {
  const { organization, repositoryName } = options;
  const repoUrl = `git+ssh://git@github.com/${organization}/${repositoryName}.git`;
  const githubBaseUrl = `https://github.com/${organization}/${repositoryName}`;
  const issuesUrl = `${githubBaseUrl}/issues`;
  const homepageUrl = `${githubBaseUrl}#readme`;

  updateJson(tree, "package.json", (packageJson: PackageJson) => {
    packageJson.repository = {
      type: "git",
      url: repoUrl,
    };

    packageJson.bugs = {
      url: issuesUrl,
    };

    packageJson.homepage = homepageUrl;

    return packageJson;
  });
}
