import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";

describe("gitGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "git",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
      {
        skipGit: true,
      },
    );

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:git --commitMessage="test initial commit message" --committerEmail="test@chiubaka.com" --committerName="Test McTest"',
    );
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  it("initializes a git repo", async () => {
    await workspace.assert.git.isRepoRoot(workspace.getRoot());
  });

  describe("initial commit", () => {
    it("creates an initial commit with specified message", async () => {
      await workspace.assert.git.latestCommitMessage(
        "test initial commit message",
      );
    });

    it("creates an initial commit with specified author name", async () => {
      await workspace.assert.git.latestCommitterName("Test McTest");
    });

    it("creates an initial commit with specified author email", async () => {
      await workspace.assert.git.latestCommitterEmail("test@chiubaka.com");
    });
  });

  it("leaves the working directory clean", async () => {
    await workspace.assert.git.workingDirectoryIsClean();
  });
});
