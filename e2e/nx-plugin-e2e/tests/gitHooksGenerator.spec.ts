import { runNxCommandAsync } from "@nrwl/nx-plugin/testing";

import { assert, createTestingWorkspace } from "../utils";

jest.setTimeout(40_000);

describe("gitHooksGenerator", () => {
  beforeAll(async () => {
    createTestingWorkspace("@chiubaka/nx-plugin", "dist/packages/nx-plugin");

    await runNxCommandAsync(
      'generate @chiubaka/nx-plugin:gitHooks --preCommitCommand="echo pre-commit" --prePushCommand="echo pre-push"',
    );
  });

  afterAll(async () => {
    await runNxCommandAsync("reset");
  });

  describe("pre-commit hook", () => {
    it("creates a pre-commit hook", () => {
      assert.fs.exists(".husky/pre-commit");
    });

    it("populates the pre-commit hook with the correct command", () => {
      assert.fs.fileContents(".husky/pre-commit", "echo pre-commit");
    });
  });

  describe("pre-push hook", () => {
    it("creates a pre-push hook", () => {
      assert.fs.exists(".husky/pre-push");
    });

    it("populates the pre-push hook with the correct command", () => {
      assert.fs.fileContents(".husky/pre-push", "echo pre-push");
    });
  });
});
