import { Tree } from "@nrwl/devkit";

import { Project } from "../../../../src/index";
import { eslintProjectTestCases } from "../eslintProjectTestCases";
import { projectJsonTestCases } from "../projectJsonTestCases";
import { tsconfigTestCases } from "../tsconfigTestCases";

export const reactE2eProjectTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
  });

  it("generates a cypress.config.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path("cypress.config.ts"))).toBe(true);
  });

  describe("cypress.config.ts", () => {
    it("matches snapshot", () => {
      const contents = tree.read(project.path("cypress.config.ts"))?.toString();

      expect(contents).toMatchSnapshot();
    });
  });

  projectJsonTestCases(getProject);
  tsconfigTestCases(getProject, {
    skipAppOrLibConfig: true,
    skipTestConfig: true,
  });
  eslintProjectTestCases(getProject);
};
