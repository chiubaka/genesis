import { runNxCommandAsync, tmpProjPath } from "@nrwl/nx-plugin/testing";

import { assert, createTestingWorkspace } from "../utils";

jest.setTimeout(40_000);

describe("gitGenerator", () => {
  beforeAll(async () => {
    createTestingWorkspace("@chiubaka/nx-plugin", "dist/packages/nx-plugin", {
      skipGit: true,
    });

    await runNxCommandAsync(
      'generate @chiubaka/nx-plugin:git --commitMessage="test initial commit message" --committerEmail="test@chiubaka.com" --committerName="Test McTest"',
    );
  });

  afterAll(async () => {
    await runNxCommandAsync("reset");
  });

  it("initializes a git repo", async () => {
    await assert.git.repoRoot(tmpProjPath());
  });

  describe("initial commit", () => {
    it("creates an initial commit with specified message", async () => {
      await assert.git.latestCommitMessage("test initial commit message");
    });

    it("creates an initial commit with specified author name", async () => {
      await assert.git.latestCommitterName("Test McTest");
    });

    it("creates an initial commit with specified author email", async () => {
      await assert.git.latestCommitterEmail("test@chiubaka.com");
    });
  });

  it("leaves the working directory clean", async () => {
    await assert.git.workingDirectoryIsClean();
  });
});
