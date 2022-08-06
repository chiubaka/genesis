import { createTestingWorkspace, TestingWorkspace } from "../utils";

jest.setTimeout(40_000);

describe("gitHooksGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "git-hooks",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:gitHooks --preCommitCommand="echo pre-commit" --prePushCommand="echo pre-push"',
    );
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  describe("pre-commit hook", () => {
    it("creates a pre-commit hook", () => {
      workspace.assert.fs.exists(".husky/pre-commit");
    });

    it("populates the pre-commit hook with the correct command", () => {
      workspace.assert.fs.fileContents(".husky/pre-commit", "echo pre-commit");
    });
  });

  describe("pre-push hook", () => {
    it("creates a pre-push hook", () => {
      workspace.assert.fs.exists(".husky/pre-push");
    });

    it("populates the pre-push hook with the correct command", () => {
      workspace.assert.fs.fileContents(".husky/pre-push", "echo pre-push");
    });
  });
});
