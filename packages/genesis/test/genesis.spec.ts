jest.mock("node:child_process");

import { spawn } from "node:child_process";

import { genesis, parseImportPath } from "../bin/genesis";

jest.setTimeout(20_000);

describe("genesis", () => {
  it("passes the correct variables down to `create-nx-workspace`", () => {
    genesis([
      "node",
      "genesis",
      "@chiubaka/genesis",
      "-r",
      "http://localhost:4873",
      "--disable-immutable-installs",
      "-d",
      "Test description",
      "--skip-github",
    ]);

    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith(
      "npx",
      [
        "create-nx-workspace",
        "chiubaka",
        "--preset=@chiubaka/nx-plugin",
        "--nxCloud=false",
        "--directory=genesis",
        "--workspaceName=genesis",
        "--workspaceScope=chiubaka",
        "--skipGit",
        "--skipGitHub",
        "--registry=http://localhost:4873",
        "--disableImmutableInstalls=true",
        '--description="Test description"',
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          npm_config_registry: "http://localhost:4873",
          NX_VERBOSE_LOGGING: "true",
        },
        stdio: "inherit",
      },
    );
  });
});

describe("parseImportPath", () => {
  it("separates the workspace scope from workspace name", () => {
    const { workspaceScope, workspaceName } =
      parseImportPath("@chiubaka/genesis");

    expect(workspaceScope).toBe("chiubaka");
    expect(workspaceName).toBe("genesis");
  });

  it("throws an error if given an invalid import path", () => {
    expect(() => {
      parseImportPath("@chiubaka/invalid/path");
    }).toThrow("@chiubaka/invalid/path is not a valid import path");
  });
});
