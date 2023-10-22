import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";
import {
  copyFileSync,
  mkdirpSync,
  readFileSync,
  writeFileSync,
} from "fs-extra";
import path from "node:path";

describe("lintingGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "linting",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:linting --packageManager="npm"',
    );

    mkdirpSync(workspace.path("scripts"));
    copyFileSync(
      path.join(
        __dirname,
        "../../../packages/nx-plugin/src/generators/workspace/preset/files/scripts/ci.sh",
      ),
      workspace.path("scripts/ci.sh"),
    );
    const ciScript = readFileSync(workspace.path("scripts/ci.sh")).toString();
    writeFileSync(
      workspace.path("scripts/ci.sh"),
      // eslint-disable-next-line unicorn/prefer-string-replace-all
      ciScript.replace(/yarn/g, "npm run"),
    );

    // Generation of `tsconfig.base.json` was removed from empty workspaces in
    // Nx v15.8.0, but is required for the linting generator to work properly.
    workspace.fs.writeJsonFile("tsconfig.base.json", {
      compileOnSave: false,
      compilerOptions: {
        rootDir: ".",
        baseUrl: ".",
      },
      exclude: ["node_modules", "tmp"],
    });

    await workspace.git.commitAllFiles(
      "Add files generated by @chiubaka/nx-plugin:linting",
    );
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  describe("linting", () => {
    it("generates a working linting setup", async () => {
      await workspace.assert.linting.hasValidConfig();
    });

    it("generates a working lint fix setup", async () => {
      await workspace.assert.linting.canFixIssues();
    });

    it("generates a project without linting issues", async () => {
      await workspace.assert.linting.isClean();
    });

    it("generates a working lint-staged setup", async () => {
      await workspace.assert.linting.canFixStagedIssues();
    });
  });

  describe("scripts", () => {
    it("generates a working lint:affected script", async () => {
      await workspace.assert.script.runsSuccessfully("lint:affected");
    });

    // Nx changed the behavior of running nx run-many --all in v15.4.x such
    // that the command now fails if there are no projects in the workspace
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("generates a working lint:all scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:all");
    });

    // This command fails on CI, seemingly due to $NX_BASE and $NX_HEAD referring
    // to bad commits in a nested repo context.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("generates a working lint:ci scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:ci");
    });

    // Nx changed the behavior of running nx run-many --all in v15.4.x such
    // that the command now fails if there are no projects in the workspace
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("generates a working lint:fix:all scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:fix:all");
    });

    // Nx changed the behavior of running nx run-many --all in v15.4.x such
    // that the command now fails if there are no projects in the workspace
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("generates a working lint:fix:packages scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:fix:packages");
    });

    it("generates a working lint:fix:root scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:fix:root");
    });

    // Nx changed the behavior of running nx run-many --all in v15.4.x such
    // that the command now fails if there are no projects in the workspace
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("generates a working lint:packages scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:packages");
    });

    it("generates a working lint:root scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:root");
    });

    it("generates a working lint:staged scripts", async () => {
      await workspace.assert.script.runsSuccessfully("lint:staged");
    });
  });
});
