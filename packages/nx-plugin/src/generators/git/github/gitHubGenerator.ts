import { Tree } from "@nrwl/devkit";

import { generatorLogger as logger } from "../../../logger/index";
import { exec } from "../../../utils/index";
import { GitHubApiAdapter } from "./GitHubApiAdapter";
import { GitHubGeneratorSchema } from "./gitHubGenerator.schema";

const github = new GitHubApiAdapter();

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

  return async () => {
    logger.info("Running post-processing tasks for GitHub generator");

    await createOrUpdateRepoTask();
    await addGitRemoteTask();
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
