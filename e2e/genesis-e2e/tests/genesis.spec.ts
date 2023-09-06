import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";
import path from "node:path";

describe("genesis", () => {
  let workspace: TestingWorkspace;

  beforeAll(() => {
    const destination = e2eTmpPath("genesis-e2e");
    workspace = new TestingWorkspace(destination);
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  it("should create a workspace root directory matching name option, not org scope", () => {
    const workspaceName = path.basename(workspace.getRoot());

    expect(workspaceName).toBe("genesis-e2e");
  });

  it("should not create an apps dir", () => {
    workspace.assert.fs.notExists("apps");
  });

  describe(".gitignore", () => {
    it("generates a .gitignore file", () => {
      workspace.assert.fs.exists(".gitignore");
    });

    it("ignores the reports directory", () => {
      workspace.assert.fs.fileContents(".gitignore", "/reports");
    });
  });

  describe("package manager", () => {
    it("should install packages with yarn", () => {
      workspace.assert.fs.exists("yarn.lock");
    });

    it("should install packages with yarn v3", () => {
      workspace.assert.fs.fileContents(".yarnrc.yml", ".yarn/releases/yarn-3.");
    });

    it("should continue to use the yarn v3 node-modules nodeLinker for compatibility", () => {
      workspace.assert.fs.fileContents(
        ".yarnrc.yml",
        "nodeLinker: node-modules",
      );
    });

    it("should not install packages with npm", () => {
      workspace.assert.fs.notExists("package-lock.json");
    });
  });

  describe("tsconfig", () => {
    it("generates a tsconfig.base.json file", () => {
      workspace.assert.fs.exists("tsconfig.base.json");
    });

    describe("tsconfig.base.json", () => {
      it("extends from @chiubaka/tsconfig", () => {
        workspace.assert.fs.jsonFileContents("tsconfig.base.json", {
          extends: "@chiubaka/tsconfig",
        });
      });
    });
  });

  describe("linting", () => {
    it("creates a working linting setup", async () => {
      await workspace.assert.linting.hasValidConfig();
    });

    it("creates a working lint fix setup", async () => {
      await workspace.assert.linting.canFixIssues();
    });

    it("generates a project without linting issues", async () => {
      await workspace.assert.linting.isClean();
    });

    it("generates a working lint-staged setup", async () => {
      await workspace.assert.linting.canFixStagedIssues();
    });
  });

  describe("README", () => {
    it("generates a root README.md file", () => {
      workspace.assert.fs.exists("README.md");
    });

    it("uses the workspace's name as the title of the README", () => {
      workspace.assert.fs.fileContents("README.md", "# genesis");
    });
  });

  describe("git", () => {
    it("creates an initial commit with a generated message", async () => {
      await workspace.assert.git.latestCommitMessage(
        `Initial commit with files generated by @chiubaka/nx-plugin`,
      );
    });

    it("leaves the working directory clean", async () => {
      await workspace.assert.git.workingDirectoryIsClean();
    });
  });

  describe("git hooks", () => {
    describe("pre-commit hook", () => {
      it("creates a pre-commit hook", () => {
        workspace.assert.fs.exists(".husky/pre-commit");
      });

      it("populates the pre-commit hook with the correct command", () => {
        workspace.assert.fs.fileContents(
          ".husky/pre-commit",
          "yarn lint:staged",
        );
      });
    });

    describe("pre-push hook", () => {
      it("creates a pre-push hook", () => {
        workspace.assert.fs.exists(".husky/pre-push");
      });

      it("populates the pre-push hook with the correct command", () => {
        workspace.assert.fs.fileContents(
          ".husky/pre-push",
          "yarn test:affected",
        );
      });
    });
  });

  describe("testing", () => {
    it("generates a Codecov configuration file", () => {
      workspace.assert.fs.exists("codecov.yml");
    });

    it("generates a jest.config.ts file", () => {
      workspace.assert.fs.exists("jest.config.ts");
    });

    it("generates a jest.preset.js file", () => {
      workspace.assert.fs.exists("jest.preset.js");
    });
  });

  describe("CI", () => {
    it("generates a .circleci/config.yml file", () => {
      workspace.assert.fs.exists(".circleci/config.yml");
    });
  });
});
