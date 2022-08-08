import { tmpProjPath, uniq } from "@nrwl/nx-plugin/testing";
import { ensureDirSync, moveSync, removeSync } from "fs-extra";
import { ChildProcess, execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

import { startVerdaccio, TestingWorkspace } from "../utils";

jest.setTimeout(10_000);

describe("presetGenerator", () => {
  let verdaccioProcess: ChildProcess;
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    const verdaccio = await startVerdaccio();
    verdaccioProcess = verdaccio.process;

    execSync(`yarn config set registry ${verdaccio.url}`);

    execSync(
      `npx npm-cli-login -u chiubaka -p test -e test@chiubaka.com -r ${verdaccio.url}`,
    );
    execSync(`npm publish --registry=${verdaccio.url}`, {
      cwd: path.join(__dirname, "../../../dist/packages/nx-plugin"),
    });

    const workspaceName = "preset";

    const tmpDir = path.join(os.tmpdir(), uniq(workspaceName));
    ensureDirSync(tmpDir);

    execSync(
      `npm_config_registry=${verdaccio.url} npx create-nx-workspace ${workspaceName} --preset=@chiubaka/nx-plugin --nxCloud=false`,
      {
        // Create the workspace in tmp dir then copy it into project tmp dir to allow for git initialization which
        // is important for some of our generators
        cwd: tmpDir,
      },
    );

    const tmpDestination = path.join(tmpDir, workspaceName);
    const destination = path.join(tmpProjPath(), "..", workspaceName);

    removeSync(destination);
    moveSync(tmpDestination, destination);

    workspace = new TestingWorkspace(destination);
  });

  afterAll(async () => {
    await workspace.execNx("reset");

    execSync(`yarn config set registry https://registry.yarnpkg.com`);

    verdaccioProcess.kill();
  });

  it("should not create an apps dir", () => {
    workspace.assert.fs.notExists("apps");
  });

  describe("package manager", () => {
    it("should install packages with yarn", () => {
      workspace.assert.fs.exists("yarn.lock");
    });

    it("should not install packages with npm", () => {
      workspace.assert.fs.notExists("package-lock.json");
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

  describe("git", () => {
    it("creates an initial commit with a generated message", async () => {
      await workspace.assert.git.latestCommitMessage(
        "Initial commit with files generated by @chiubaka/nx-plugin@0.0.1 preset.",
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
          "nx affected --target=test",
        );
      });
    });
  });
});
