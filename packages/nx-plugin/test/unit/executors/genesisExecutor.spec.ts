jest.mock("../../../src/utils");
jest.mock("fs-extra");

import { tmpProjPath } from "@nx/plugin/testing";
import { moveSync } from "fs-extra";
import path from "node:path";

import { genesisExecutor } from "../../../src";
import { spawn } from "../../../src/utils";

const DEFAULT_OPTIONS = {
  workspaceScope: "chiubaka",
  workspaceName: "genesis-executor",
  description: "Testing for the genesis executor",
  skipGitHub: true,
  disableImmutableInstalls: true,
};

type ExecMock = jest.Mock<any, [string, { env: Record<string, any> }]>;

describe("genesisExecutor", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("with default options", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await genesisExecutor(DEFAULT_OPTIONS);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("runs successfully", () => {
      expect(result).toEqual({ success: true });
    });

    it("executes the correct commnad", () => {
      expect(spawn).toHaveBeenCalledTimes(1);

      const calls = (spawn as unknown as ExecMock).mock.calls;

      expect(calls[0][0]).toBe(
        'genesis @chiubaka/genesis-executor --description="Testing for the genesis executor" --disable-immutable-installs --skip-github',
      );
    });

    it("moves the generated workspace to the correct destination", () => {
      const calls = (moveSync as jest.Mock<any, [string, string]>).mock.calls;

      expect(calls[0][1]).toBe(path.join(tmpProjPath(), "../genesis-executor"));
    });
  });

  describe("when immutable installs are not disabled", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await genesisExecutor({
        ...DEFAULT_OPTIONS,
        disableImmutableInstalls: false,
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("runs successfully", () => {
      expect(result).toEqual({ success: true });
    });

    it("executes the correct command", () => {
      expect(spawn).toHaveBeenCalledTimes(1);

      const calls = (spawn as unknown as ExecMock).mock.calls;

      expect(calls[0][0]).toBe(
        'genesis @chiubaka/genesis-executor --description="Testing for the genesis executor" --skip-github',
      );
    });
  });

  describe("when github is not disabled", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await genesisExecutor({
        ...DEFAULT_OPTIONS,
        skipGitHub: false,
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("runs successfully", () => {
      expect(result).toEqual({ success: true });
    });

    it("executes the correct command", () => {
      expect(spawn).toHaveBeenCalledTimes(1);

      const calls = (spawn as unknown as ExecMock).mock.calls;

      expect(calls[0][0]).toBe(
        'genesis @chiubaka/genesis-executor --description="Testing for the genesis executor" --disable-immutable-installs',
      );
    });
  });

  describe("when a registry is provided", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await genesisExecutor({
        ...DEFAULT_OPTIONS,
        registry: "http://localhost:4873",
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("runs successfully", () => {
      expect(result).toEqual({ success: true });
    });

    it("executes the correct command", () => {
      expect(spawn).toHaveBeenCalledTimes(1);

      const calls = (spawn as unknown as ExecMock).mock.calls;
      const env = calls[0][1].env;

      expect(calls[0][0]).toBe(
        'genesis @chiubaka/genesis-executor --description="Testing for the genesis executor" --disable-immutable-installs --skip-github --registry=http://localhost:4873',
      );
      expect(env).toMatchObject({
        ...process.env,
        npm_config_registry: "http://localhost:4873",
      });
    });
  });

  describe("when a destination is provided", () => {
    let result: { success: boolean };

    beforeAll(async () => {
      result = await genesisExecutor({
        ...DEFAULT_OPTIONS,
        destination: "/foo/bar",
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("runs successfully", () => {
      expect(result).toEqual({ success: true });
    });

    it("moves the generated workspace to the correct destination", () => {
      expect(moveSync).toHaveBeenCalledTimes(1);

      const calls = (moveSync as jest.Mock<any, [string, string]>).mock.calls;
      const destination = calls[0][1];

      expect(destination).toBe("/foo/bar");
    });
  });
});
