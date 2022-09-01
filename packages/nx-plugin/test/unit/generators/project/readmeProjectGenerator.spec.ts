import { createTreeWithLibWorkspace } from "@chiubaka/nx-plugin-testing";

import { Project, readmeProjectGenerator } from "../../../../src";
import { readmeProjectTestCases } from "../../../cases";

describe("readmeProjectGenerator", () => {
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    const projectName = "readme-project";
    const projectType = "library";

    const tree = await createTreeWithLibWorkspace(projectName);
    tree.write(
      "README.md",
      "[![codecov](https://codecov.io/gh/proj/readme-project/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/proj/readme-project)",
    );
    readmeProjectGenerator(tree, {
      projectName,
      projectType,
      rootProjectGeneratorName: "project.readme",
    });

    project = new Project(tree, projectName, projectType);
  });

  readmeProjectTestCases(getProject);
});
