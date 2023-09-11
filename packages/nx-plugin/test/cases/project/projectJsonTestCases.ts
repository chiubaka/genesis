import { ProjectConfiguration, readJson, Tree } from "@nx/devkit";

import { Project } from "../../../src";

export const projectJsonTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;

  let projectJsonPath: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();

    projectJsonPath = project.path("project.json");
  });

  it("generates a project.json file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(projectJsonPath)).toBe(true);
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson<ProjectConfiguration>(tree, projectJsonPath);
    });

    it("matches snapshot", () => {
      expect(projectJson).toMatchSnapshot();
    });
  });
};
