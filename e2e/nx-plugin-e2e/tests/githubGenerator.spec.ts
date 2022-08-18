import {
  github,
  GitHubBranchProtection,
  GitHubRepo,
} from "@chiubaka/nx-plugin/utils";
import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";

const TEST_REPO_NAME = ".genesis-test-github-e2e";

describe("gitHubGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "github",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx(
      `generate @chiubaka/nx-plugin:github --organization="chiubaka" --repositoryName="${TEST_REPO_NAME}" --repositoryDescription="Test GitHub repository for genesis E2E tests" --privateRepository=true --enableCodecovStatusChecks --enableCircleCiStatusChecks`,
    );
  });

  afterAll(async () => {
    await github.updateRepo({
      owner: "chiubaka",
      name: TEST_REPO_NAME,
      description: "",
      allowMergeCommit: true,
      allowRebaseMerge: true,
      allowSquashMerge: true,
      allowAutoMerge: false,
      allowUpdateBranch: false,
      deleteBranchOnMerge: false,
    });

    await github.deleteBranchProtection("chiubaka", TEST_REPO_NAME, "master");
  });

  it("generates a GitHub repo", async () => {
    const repoExists = await github.repoExists("chiubaka", TEST_REPO_NAME);

    expect(repoExists).toBe(true);
  });

  it("pushes all committed code to the remote master branch", async () => {
    await workspace.git.fetchOriginMaster();

    const latestCommitHash = await workspace.git.getLatestCommitHash();
    const latestRemoteCommitHash =
      await workspace.git.getLatestRemoteCommitHash();

    expect(latestCommitHash).toEqual(latestRemoteCommitHash);
  });

  describe("repo settings", () => {
    let repo: GitHubRepo;

    beforeAll(async () => {
      repo = await github.getRepo("chiubaka", TEST_REPO_NAME);
    });

    it("sets the the repo's description", () => {
      expect(repo.description).toBe(
        "Test GitHub repository for genesis E2E tests",
      );
    });

    it("is private", () => {
      expect(repo.isPrivate).toBe(true);
    });

    it("disables merge commits", () => {
      expect(repo.allowMergeCommit).toBe(false);
    });

    it("enables squash merging", () => {
      expect(repo.allowSquashMerge).toBe(true);
    });

    it("enables rebase merging", () => {
      expect(repo.allowRebaseMerge).toBe(true);
    });

    it("enables suggesting updating pull request branches", () => {
      expect(repo.allowUpdateBranch).toBe(true);
    });

    it("enables auto-merge", () => {
      expect(repo.allowAutoMerge).toBe(true);
    });

    it("enables automatically deleting head branches after PRs merge", () => {
      expect(repo.deleteBranchOnMerge).toBe(true);
    });
  });

  describe("master branch protection settings", () => {
    let branchProtection: GitHubBranchProtection;

    beforeAll(async () => {
      branchProtection = await github.getBranchProtection(
        "chiubaka",
        TEST_REPO_NAME,
        "master",
      );
    });

    it("adds CircleCI status checks", () => {
      expect(branchProtection.requiredStatusChecks).toContain(
        "lint-build-test-deploy",
      );
    });

    it("adds Codecov status checks", () => {
      expect(branchProtection.requiredStatusChecks).toContain("codecov/patch");
      expect(branchProtection.requiredStatusChecks).toContain(
        "codecov/project",
      );
    });

    it("enables strict status checks", () => {
      expect(branchProtection.requiredStatusChecksStrict).toBe(true);
    });

    it("requires a linear history", () => {
      expect(branchProtection.requiredLinearHistory).toBe(true);
    });

    it("disables force pushes", () => {
      expect(branchProtection.allowForcePushes).toBe(false);
    });

    it("disables deletions", () => {
      expect(branchProtection.allowDeletions).toBe(false);
    });

    it("requires conversation resolution for PRs", () => {
      expect(branchProtection.requiredConversationResolution).toBe(true);
    });

    it("does not enforce protections for admins", () => {
      expect(branchProtection.enforceAdmins).toBe(false);
    });
  });

  describe("labels", () => {
    it.todo("generates a standardized label set");
  });
});
