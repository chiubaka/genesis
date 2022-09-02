import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import {
  CodecovConfig,
  codecovGenerator,
  CodecovTargetStatus,
  readYaml,
} from "../../../../src";

describe("codecovGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    codecovGenerator(tree);
  });

  it("creates a codecov.yml file in the workspace root", () => {
    expect(tree.exists("codecov.yml")).toBe(true);
  });

  describe("codecov.yml", () => {
    let codecov: CodecovConfig;

    beforeAll(() => {
      codecov = readYaml<CodecovConfig>(tree, "codecov.yml");
    });

    it("specifies default coverage rules for flags", () => {
      expect(codecov.flag_management?.default_rules).toBeDefined();
    });

    it("carries coverage rules for flags forward", () => {
      expect(codecov.flag_management?.default_rules?.carryforward).toBe(true);
    });

    describe("coverage statuses", () => {
      let statuses: CodecovTargetStatus[];

      beforeAll(() => {
        statuses = codecov.flag_management?.default_rules
          ?.statuses as CodecovTargetStatus[];
      });

      it("automatically sets project coverage target", () => {
        expect(statuses).toContainEqual({
          type: "project",
          target: "auto",
          threshold: "1%",
        });
      });

      it("sets a patch coverage target", () => {
        expect(statuses).toContainEqual({
          type: "patch",
          target: "90%",
        });
      });
    });
  });
});
