import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { libraryGenerator } from "@nrwl/node";
import { Linter } from "eslint";

import { eslintProjectGenerator } from "../../../../src/generators";
import { Project } from "../../../utils";

describe("eslintProjectGenerator", () => {
  let tree: Tree;
  let project: Project;

  beforeAll(async () => {
    const projectName = "eslint-project";
    const projectType = "library";

    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: projectName,
      compiler: "tsc",
    });
    eslintProjectGenerator(tree, {
      projectName,
      projectType,
    });

    project = new Project(tree, projectName, projectType);
  });

  it("generates a .eslintrc.json file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path(".eslintrc.json"))).toBe(true);
  });

  describe(".eslintrc.json", () => {
    let eslintConfig: Linter.Config;

    beforeAll(() => {
      eslintConfig = readJson<Linter.Config>(
        tree,
        project.path(".eslintrc.json"),
      );
    });

    it("extends from the root monorepo .eslintrc.json file", () => {
      expect(eslintConfig.extends).toEqual(["../../.eslintrc.json"]);
    });

    it("only ignores node_modules", () => {
      expect(eslintConfig.ignorePatterns).toEqual(["node_modules"]);
    });
  });
});
