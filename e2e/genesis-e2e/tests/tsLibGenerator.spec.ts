import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  copyWorkspaceTemplate,
  e2eProjectTestCases,
  projectTestCases,
} from "../utils";

describe("tsLibGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("lib.ts");

    await workspace.execNx("generate @chiubaka/nx-plugin:lib.ts --name=ts-lib");
  });

  it("generates a single lib project", () => {
    workspace.assert.fs.hasChildDirectories("packages", ["ts-lib"]);
  });

  it("generates a single E2E project", () => {
    workspace.assert.fs.hasChildDirectories("e2e", ["ts-lib-e2e"]);
  });

  projectTestCases("ts-lib", getWorkspace);

  it("produces a library project that can be consumed by another project", async () => {
    await expect(workspace.execNx("e2e ts-lib-e2e")).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    e2eProjectTestCases("ts-lib-e2e", getWorkspace);
  });
});
