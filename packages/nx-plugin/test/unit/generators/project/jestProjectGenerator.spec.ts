import { createTreeWithLibWorkspace } from "@chiubaka/nx-plugin-testing";

import { jestProjectGenerator, Project } from "../../../../src";
import { jestProjectTestCases } from "../../../cases/project/jestProjectTestCases";

describe("jestProjectGenerator", () => {
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    const projectName = "jest-project";
    const projectType = "library";

    const tree = await createTreeWithLibWorkspace(projectName);
    project = new Project(tree, projectName, projectType);

    await jestProjectGenerator(tree, {
      projectName,
      projectType,
    });
  });

  jestProjectTestCases(getProject);
});
