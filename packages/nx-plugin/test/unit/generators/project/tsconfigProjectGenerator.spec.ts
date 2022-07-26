import { createTreeWithLibWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  Project,
  TsConfigGeneratorPresets,
  tsconfigProjectGenerator,
} from "../../../../src";
import { tsconfigTestCases } from "../../../cases";

describe("tsconfigProjectGenerator", () => {
  const projectName = "tsconfig-project";
  const projectType = "library";

  let project: Project;

  const getProject = () => {
    return project;
  };

  describe("without any options", () => {
    beforeAll(async () => {
      const tree = await createTreeWithLibWorkspace(projectName);
      tsconfigProjectGenerator(tree, {
        projectName,
        projectType,
      });
      project = new Project(tree, projectName, projectType);
    });

    tsconfigTestCases(getProject);
  });

  describe("with Node 18 preset", () => {
    beforeAll(async () => {
      const tree = await createTreeWithLibWorkspace(projectName);
      tsconfigProjectGenerator(tree, {
        projectName,
        projectType,
        ...TsConfigGeneratorPresets.NODE18,
      });
      project = new Project(tree, projectName, projectType);
    });

    tsconfigTestCases(getProject);
  });
});
