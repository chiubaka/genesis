import { createTree } from "@nrwl/devkit/testing";

import { Project, ProjectNames } from "../../../src";

describe("Project", () => {
  const tree = createTree();

  describe("#getNames", () => {
    describe("when input name is camelCase", () => {
      const project = new Project(tree, "nodeLib", "library");
      casingTests(project.getNames());
    });

    describe("when input name is kebab-case", () => {
      const project = new Project(tree, "node-lib", "library");
      casingTests(project.getNames());
    });

    describe("when input name is PascalCase", () => {
      const project = new Project(tree, "NodeLib", "library");
      casingTests(project.getNames());
    });
  });
});

function casingTests(projectNames: ProjectNames) {
  it("creates the correct camelCase name", () => {
    expect(projectNames.camelCase).toBe("nodeLib");
  });

  it("creates the correct kebab-case name", () => {
    expect(projectNames.kebabCase).toBe("node-lib");
  });

  it("creates the correct PascalCase name", () => {
    expect(projectNames.pascalCase).toBe("NodeLib");
  });
}
