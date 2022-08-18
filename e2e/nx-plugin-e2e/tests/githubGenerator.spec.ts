import {
  github,
  GitHubBranchProtection,
  GitHubLabel,
  GitHubRepo,
} from "@chiubaka/nx-plugin/utils";
import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";

const TEST_REPO_NAME = ".genesis-test-github-e2e";
const INITIAL_GITHUB_LABELS = [
  {
    name: "bug",
    description: "Something isn't working",
    color: "d73a4a",
  },
  {
    name: "documentation",
    description: "Improvements or additions to documentation",
    color: "0075ca",
  },
  {
    name: "duplicate",
    description: "This issue or pull request already exists",
    color: "cfd3d7",
  },
  {
    name: "enhancement",
    description: "New feature or request",
    color: "a2eeef",
  },
  {
    name: "good first issue",
    description: "Good for newcomers",
    color: "7057ff",
  },
  {
    name: "help wanted",
    description: "Extra attention is needed",
    color: "008672",
  },
  {
    name: "invalid",
    description: "This doesn't seem right",
    color: "e4e669",
  },
  {
    name: "question",
    description: "Further information is requested",
    color: "d876e3",
  },
  {
    name: "wontfix",
    description: "This will not be worked on",
    color: "ffffff",
  },
];

describe("gitHubGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "github",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx(
      `generate @chiubaka/nx-plugin:github --organization="chiubaka" --repositoryName="${TEST_REPO_NAME}" --repositoryDescription="Test GitHub repository for genesis E2E tests" --privateRepository=true --enableCodecovStatusChecks --enableCircleCiStatusChecks --forcePush`,
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

    const labels = await github.listLabels("chiubaka", TEST_REPO_NAME);
    for (const label of labels) {
      await github.deleteLabel("chiubaka", TEST_REPO_NAME, label.name);
    }

    for (const label of INITIAL_GITHUB_LABELS) {
      await github.createOrUpdateLabel({
        repoOwner: "chiubaka",
        repoName: TEST_REPO_NAME,
        ...label,
      });
    }
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
    let labels: GitHubLabel[];

    beforeAll(async () => {
      const rawLabels = await github.listLabels("chiubaka", TEST_REPO_NAME);
      labels = rawLabels.map((rawLabel) => {
        return {
          name: rawLabel.name,
          description: rawLabel.description,
          color: rawLabel.color,
        };
      });
    });

    it("deletes the good first issue label", () => {
      expect(labels).not.toContainEqual({
        name: "good first issue",
        description: "Good for newcomers",
        color: "7057ff",
      });
    });

    it("deletes the help wanted label", () => {
      expect(labels).not.toContainEqual({
        name: "help wanted",
        description: "Extra attention is needed",
        color: "008672",
      });
    });

    it("deletes the invalid label", () => {
      expect(labels).not.toContainEqual({
        name: "invalid",
        description: "This doesn't seem right",
        color: "e4e669",
      });
    });

    it("deletes the question label", () => {
      expect(labels).not.toContainEqual({
        name: "question",
        description: "Further information is requested",
        color: "d876e3",
      });
    });

    it("updates the default bug label", () => {
      expect(labels).toContainEqual({
        name: ":bug: bug",
        description: "Something isn't working.",
        color: "D93F0B",
      });
    });

    it("updates the default documentation label", () => {
      expect(labels).toContainEqual({
        name: ":scroll: documentation",
        description: "Improvements or additions to documentation.",
        color: "0075ca",
      });
    });

    it("updates the default duplicate label", () => {
      expect(labels).toContainEqual({
        name: ":copyright: duplicate",
        description: "This issue or pull request already exists.",
        color: "cfd3d7",
      });
    });

    it("updates the default enhancement label", () => {
      expect(labels).toContainEqual({
        name: ":muscle: improvement",
        description: "An improvement on something existing.",
        color: "A2EEEF",
      });
    });

    it("updates the default wontfix label", () => {
      expect(labels).toContainEqual({
        name: ":ghost: wontfix",
        description: "This will not be worked on.",
        color: "ffffff",
      });
    });

    it("creates the P0 label", () => {
      expect(labels).toContainEqual({
        name: ":fire: P0",
        description: "Fire. Drop everything and fix this ASAP.",
        color: "D93F0B",
      });
    });

    it("creates the P1 label", () => {
      expect(labels).toContainEqual({
        name: ":triangular_flag_on_post: P1",
        description: "High priority. Resolve in the next few days.",
        color: "FFA500",
      });
    });

    it("creates the P2 label", () => {
      expect(labels).toContainEqual({
        name: ":warning: P2",
        description: "Important. Resolve by next release.",
        color: "FBCA04",
      });
    });

    it("creates the P3 label", () => {
      expect(labels).toContainEqual({
        name: ":grey_exclamation: P3",
        description:
          "Low priority. Possibly nice to have. Resolve if time allows.",
        color: "0E8A16",
      });
    });

    it("creates the P4 label", () => {
      expect(labels).toContainEqual({
        name: ":icecream: P4",
        description:
          "Extremely low priority. Probably not worth spending time on right now.",
        color: "1D76DB",
      });
    });

    it("creates the blocked label", () => {
      expect(labels).toContainEqual({
        name: ":no_entry_sign: blocked",
        description: "Blocked on something external. Waiting to be unblocked.",
        color: "D93F0B",
      });
    });

    it("creates the awaiting review label", () => {
      expect(labels).toContainEqual({
        name: ":eyes: awaiting review",
        description: "Requires review before proceeding.",
        color: "FBCA04",
      });
    });

    it("creates the feature label", () => {
      expect(labels).toContainEqual({
        name: ":sparkles: feature",
        description: "New feature or request.",
        color: "5319E7",
      });
    });

    it("creates the research label", () => {
      expect(labels).toContainEqual({
        name: ":mag: research",
        description: "Issues requiring research or information gathering.",
        color: "1D76DB",
      });
    });

    it("creates the tech debt label", () => {
      expect(labels).toContainEqual({
        name: ":money_mouth_face: tech debt",
        description: "Things weighing down the stack over the long-term.",
        color: "000000",
      });
    });
  });
});
