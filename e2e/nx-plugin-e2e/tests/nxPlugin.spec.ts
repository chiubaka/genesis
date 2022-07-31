import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from "@nrwl/nx-plugin/testing";
import { NxProjectPackageJsonConfiguration } from "nx/src/utils/package-json";

describe("nx-plugin e2e", () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject("@chiubaka/nx-plugin", "dist/packages/nx-plugin");
  });

  afterAll(async () => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    await runNxCommandAsync("reset");
  });

  it("should create preset", async () => {
    const project = uniq("preset");
    await runNxCommandAsync(`generate @chiubaka/nx-plugin:preset ${project}`);
    const result = await runNxCommandAsync(`build ${project}`);

    expect(result.stdout).toContain("Executor ran");
  }, 120_000);

  describe("--directory", () => {
    it("should create src in the specified directory", async () => {
      const project = uniq("preset");
      await runNxCommandAsync(
        `generate @chiubaka/nx-plugin:preset ${project} --directory subdir`,
      );

      expect(() =>
        checkFilesExist(`libs/subdir/${project}/src/index.ts`),
      ).not.toThrow();
    }, 120_000);
  });

  describe("--tags", () => {
    it("should add tags to the project", async () => {
      const projectName = uniq("preset");
      ensureNxProject("@chiubaka/nx-plugin", "dist/packages/nx-plugin");
      await runNxCommandAsync(
        `generate @chiubaka/nx-plugin:preset ${projectName} --tags e2etag,e2ePackage`,
      );
      const project = readJson<NxProjectPackageJsonConfiguration>(
        `libs/${projectName}/project.json`,
      );

      expect(project.tags).toEqual(["e2etag", "e2ePackage"]);
    }, 120_000);
  });
});
