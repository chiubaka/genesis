import { Tree } from "@nx/devkit";

import { generatorLogger as logger } from "../../../../../logger";
import { getGitHubRepoInfo, github } from "../../../../../utils";
import { GitHubBranchProtectionGeneratorSchema } from "./gitHubBranchProtectionGenerator.schema";

export function gitHubBranchProtectionGenerator(
  tree: Tree,
  options: GitHubBranchProtectionGeneratorSchema,
) {
  logger.info(
    `Configuring GitHub branch protections with options:\n${JSON.stringify(
      options,
      undefined,
      2,
    )}`,
  );

  const protectMasterBranchTask = protectMasterBranch(tree, options);

  return async () => {
    logger.info("Running post-processing tasks for GitHub branch protection");

    await protectMasterBranchTask();
  };
}

function protectMasterBranch(
  tree: Tree,
  {
    enableCircleCiStatusChecks,
    enableCodecovStatusChecks,
  }: GitHubBranchProtectionGeneratorSchema,
) {
  const requiredStatusChecks: string[] = [];

  if (enableCircleCiStatusChecks) {
    requiredStatusChecks.push("lint-build-test-deploy");
  }

  if (enableCodecovStatusChecks) {
    requiredStatusChecks.push("codecov/patch", "codecov/project");
  }

  return async () => {
    logger.info("Updating GitHub master branch protections");

    const { organization, repositoryName } = await getGitHubRepoInfo(tree);

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
