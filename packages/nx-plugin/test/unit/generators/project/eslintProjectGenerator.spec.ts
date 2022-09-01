import { createTreeWithLibWorkspace } from "@chiubaka/nx-plugin-testing";

import { eslintProjectGenerator, Project } from "../../../../src";
import { eslintProjectTestCases } from "../../../cases";

describe("eslintProjectGenerator", () => {
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    const projectName = "eslint-project";
    const projectType = "library";

    const tree = await createTreeWithLibWorkspace(projectName);
    eslintProjectGenerator(tree, {
      projectName,
      projectType,
    });

    project = new Project(tree, projectName, projectType);
  });

  eslintProjectTestCases(getProject);
});
