import { github, GitHubRepo } from "@chiubaka/nx-plugin/utils";
import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";

const TEST_REPO_NAME = ".genesis-test-github-e2e";

describe("githubGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "git-hooks",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx(
      `generate @chiubaka/nx-plugin:github --organization="chiubaka" --repositoryName="${TEST_REPO_NAME}" --repositoryDescription="Test GitHub repository for genesis E2E tests" --privateRepository=true`,
    );
  });

  afterAll(async () => {
    await github.updateRepo({
      owner: "chiubaka",
      name: TEST_REPO_NAME,
      description: "",
      allowMergeCommit: true,
      allowRebaseMerge: false,
      allowSquashMerge: false,
      allowAutoMerge: false,
      allowUpdateBranch: false,
      deleteBranchOnMerge: false,
    });
  });

  it("generates a GitHub repo", async () => {
    const repoExists = await github.repoExists("chiubaka", TEST_REPO_NAME);

    expect(repoExists).toBe(true);
  });

  describe("repo settings", () => {
    let repo: GitHubRepo;

    beforeAll(async () => {
      repo = await github.getRepo("chiubaka", TEST_REPO_NAME);
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

  describe("branch protection settings", () => {
    it.todo("sets standardized branch protection settings");
  });

  describe("labels", () => {
    it.todo("generates a standardized label set");
  });
});
