import {
  checkFilesExist,
  readFile,
  runNxCommandAsync,
} from "@nrwl/nx-plugin/testing";

import { createTestingWorkspace } from "../utils";

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
      expect(() => {
        checkFilesExist(".husky/pre-commit");
      }).not.toThrow();
    });

    it("populates the pre-commit hook with the correct command", () => {
      const contents = readFile(".husky/pre-commit");

      expect(contents).toContain("echo pre-commit");
    });
  });

  describe("pre-push hook", () => {
    it("creates a pre-push hook", () => {
      expect(() => {
        checkFilesExist(".husky/pre-push");
      }).not.toThrow();
    });

    it("populates the pre-push hook with the correct command", () => {
      const contents = readFile(".husky/pre-push");

      expect(contents).toContain("echo pre-push");
    });
  });
});
