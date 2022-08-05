import {
  checkFilesExist,
  cleanup,
  readFile,
  runCommandAsync,
  runNxCommandAsync,
  tmpProjPath,
  uniq,
} from "@nrwl/nx-plugin/testing";
import { ensureDirSync, moveSync } from "fs-extra";
import { ChildProcess, execSync, fork } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getPortPromise as getOpenPort } from "portfinder";

jest.setTimeout(10_000);

const startVerdaccio = async (port: number): Promise<ChildProcess> => {
  const configPath = path.join(__dirname, "../verdaccio.yml");
  return new Promise((resolve, reject) => {
    const child = fork(require.resolve("verdaccio/bin/verdaccio"), [
      "-c",
      configPath,
      "-l",
      `${port}`,
    ]);

    child.on("message", (message: { verdaccio_started: boolean }) => {
      if (message.verdaccio_started) {
        resolve(child);
      }
    });
    child.on("error", (error: any) => reject([error]));
    child.on("disconnect", (error: any) => reject([error]));
  });
};

describe("presetGenerator", () => {
  let verdaccioProcess: ChildProcess;

  beforeAll(async () => {
    cleanup();

    const verdaccioPort = await getOpenPort();
    verdaccioProcess = await startVerdaccio(verdaccioPort);

    const verdaccioUrl = `http://localhost:${verdaccioPort}`;

    execSync(`yarn config set registry ${verdaccioUrl}`);

    execSync(
      `npx npm-cli-login -u chiubaka -p test -e test@chiubaka.com -r ${verdaccioUrl}`,
    );
    execSync(`npm publish --registry=${verdaccioUrl}`, {
      cwd: path.join(__dirname, "../../../dist/packages/nx-plugin"),
    });

    const workspaceName = path.basename(tmpProjPath());

    const tmpDir = path.join(os.tmpdir(), uniq(workspaceName));
    ensureDirSync(tmpDir);

    execSync(
      `npm_config_registry=${verdaccioUrl} npx create-nx-workspace ${workspaceName} --preset=@chiubaka/nx-plugin --nxCloud=false`,
      {
        // Create the workspace in tmp dir then copy it into project tmp dir to allow for git initialization which
        // is important for some of our generators
        cwd: tmpDir,
      },
    );

    const tmpDestination = path.join(tmpDir, workspaceName);
    moveSync(tmpDestination, tmpProjPath());
  });

  afterAll(async () => {
    await runNxCommandAsync("reset");

    execSync(`yarn config set registry https://registry.yarnpkg.com`);

    verdaccioProcess.kill();
  });

  it("should not create an apps dir", () => {
    expect(() => {
      checkFilesExist("apps");
    }).toThrow();
  });

  describe("package manager", () => {
    it("should install packages with yarn", () => {
      expect(() => {
        checkFilesExist("yarn.lock");
      }).not.toThrow();
    });

    it("should not install packages with npm", () => {
      expect(() => {
        checkFilesExist("package-lock.json");
      }).toThrow();
    });
  });

  describe("linting", () => {
    it("creates a working linting setup", () => {
      expect(async () => {
        await runCommandAsync("yarn run eslint --print-config package.json");
      }).not.toThrow();
    });

    it("creates a working lint fix setup", async () => {
      const lintErrorsFileName = `${uniq("fixableLintErrors")}.ts`;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFileSync(
        tmpProjPath(lintErrorsFileName),
        "export const hello = 'Hello, world!'",
      );

      await expect(async () => {
        await runCommandAsync("yarn run eslint .");
      }).rejects.toThrow();

      await runCommandAsync("yarn run eslint --fix .");

      expect(async () => {
        await runCommandAsync("yarn run eslint .");
      }).not.toThrow();

      fs.rmSync(tmpProjPath(lintErrorsFileName));
    });

    it("generates a project without linting issues", () => {
      expect(async () => {
        await runCommandAsync("yarn run eslint .");
      }).not.toThrow();
    });
  });

  describe("git hooks", () => {
    describe.skip("pre-commit hook", () => {
      it("creates a pre-commit hook", () => {
        expect(() => {
          checkFilesExist(".husky/pre-commit");
        }).not.toThrow();
      });

      it.todo("populates the pre-commit hook with the correct command");
    });

    describe("pre-push hook", () => {
      it("creates a pre-push hook", () => {
        expect(() => {
          checkFilesExist(".husky/pre-push");
        }).not.toThrow();
      });

      it("populates the pre-push hook with the correct command", () => {
        const content = readFile(".husky/pre-push");

        expect(content).toContain("nx affected --target=test");
      });
    });
  });
});