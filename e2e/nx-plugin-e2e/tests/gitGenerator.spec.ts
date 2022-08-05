import {
  runCommandAsync,
  runNxCommandAsync,
  tmpProjPath,
} from "@nrwl/nx-plugin/testing";

import { createTestingWorkspace } from "../utils";

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
    const { stdout } = await runCommandAsync("git rev-parse --show-toplevel");

    const gitRoot = stdout.trim();

    expect(gitRoot).toBe(tmpProjPath());
  });

  describe("initial commit", () => {
    it("creates an initial commit with specified message", async () => {
      const { stdout } = await runCommandAsync("git log --oneline -n 1");

      // Remove the first token of the output, which is the short commit hash
      const tokens = stdout.trim().split(" ");
      tokens.shift();
      const commitMessage = tokens.join(" ");

      expect(commitMessage).toBe("test initial commit message");
    });

    it("creates an initial commit with specified author name", async () => {
      const { stdout: commitAuthorName } = await runCommandAsync(
        "git log --oneline -n 1 --pretty=format:'%an'",
      );

      expect(commitAuthorName).toBe("Test McTest");
    });

    it("creates an initial commit with specified author email", async () => {
      const { stdout: commitAuthorName } = await runCommandAsync(
        "git log --oneline -n 1 --pretty=format:'%ae'",
      );

      expect(commitAuthorName).toBe("test@chiubaka.com");
    });
  });

  it("leaves the working directory clean", async () => {
    const { stdout: gitStatus } = await runCommandAsync(
      "git status --porcelain",
    );

    expect(gitStatus).toBe("");
  });
});
