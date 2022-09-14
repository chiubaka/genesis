jest.mock("../../../src/utils");

import { workspaceRoot } from "@nrwl/devkit";
import path from "node:path";

import { npmPublishExecutor } from "../../../src";
import { exec } from "../../../src/utils";

type ExecMock = jest.Mock<any, [string, { cwd: string }]>;

describe("npmPublishExecutor", () => {
  describe("with default options", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await npmPublishExecutor({
        access: "public",
        dryRun: false,
        registryUrl: "https://registry.npmjs.org",
        packagePath: "dist/packages/nx-plugin",
        skipLogin: true,
        skipUnpublish: true,
      });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("executes successfully", () => {
      expect(result.success).toBe(true);
    });

    it("does not login", () => {
      const calls = (exec as unknown as ExecMock).mock.calls;

      const matchingCommand = calls.find(([command]) => {
        return command.startsWith("npx npm-cli-login");
      });

      expect(matchingCommand).toBeUndefined();
    });

    it("does not run unpublish", () => {
      const calls = (exec as unknown as ExecMock).mock.calls;

      const matchingCommand = calls.find(([command]) => {
        return command.startsWith("npm unpublish");
      });

      expect(matchingCommand).toBeUndefined();
    });

    it("runs the publish command with the correct options", () => {
      expect(exec).toHaveBeenCalledWith(
        "npm publish --registry=https://registry.npmjs.org --access=public --dry-run=false",
        {
          cwd: path.join(workspaceRoot, "dist/packages/nx-plugin"),
        },
      );
    });
  });

  describe("when skipLogin is false", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await npmPublishExecutor({
        access: "public",
        dryRun: true,
        registryCredentials: {
          email: "test@chiubaka.com",
          username: "test",
          password: "test",
        },
        registryUrl: "https://registry.npmjs.org",
        packagePath: "dist/packages/nx-plugin",
        skipLogin: false,
        skipUnpublish: true,
      });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("runs successfully", () => {
      expect(result.success).toBe(true);
    });

    it("runs the login command", () => {
      expect(exec).toHaveBeenCalledWith(
        "npx npm-cli-login -r https://registry.npmjs.org -u test -p test -e test@chiubaka.com",
      );
    });
  });

  describe("when skipUnpublish is false", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await npmPublishExecutor({
        access: "public",
        dryRun: true,
        registryUrl: "https://registry.npmjs.org",
        packagePath: "dist/packages/nx-plugin",
        skipLogin: true,
        skipUnpublish: false,
      });
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("runs successfully", () => {
      expect(result.success).toBe(true);
    });

    it("runs the unpublish command with the correct options", () => {
      expect(exec).toHaveBeenCalledWith(
        "npm unpublish --force --registry=https://registry.npmjs.org --dry-run=true",
        {
          cwd: path.join(workspaceRoot, "dist/packages/nx-plugin"),
        },
      );
    });
  });
});
