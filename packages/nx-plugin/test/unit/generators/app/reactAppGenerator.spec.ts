import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, reactAppGenerator } from "../../../../src";
import {
  reactE2eProjectTestCases,
  reactProjectTestCases,
} from "../../../cases";

describe("reactAppGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  const getProject = () => {
    return project;
  };

  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "react-app", "application");
    e2eProject = new Project(tree, "react-app-e2e", "e2e");
  });

  reactProjectTestCases(getProject);

  beforeAll(async () => {
    await reactAppGenerator(tree, {
      name: "react-app",
    });
  });

  describe("sample code", () => {
    it("creates an app directory", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("app"))).toBe(true);
    });

    describe("creates a sample component", () => {
      it("creates an app/App.tsx file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.srcPath("app/App.tsx"))).toBe(true);
      });

      it("creates an app/App.module.scss file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.srcPath("app/App.module.scss"))).toBe(true);
      });

      it("creates an app/App.stories.tsx file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.srcPath("app/App.stories.tsx"))).toBe(true);
      });

      it("creates an app/NxWelcome.tsx file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.srcPath("app/NxWelcome.tsx"))).toBe(true);
      });

      it("creates an app/NxWelcome.stories.tsx file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.srcPath("app/NxWelcome.stories.tsx"))).toBe(
          true,
        );
      });

      it("creates a sample unit test", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(project.testPath("unit/App.spec.tsx"))).toBe(true);
      });
    });
  });

  describe("E2E project", () => {
    reactE2eProjectTestCases(getE2eProject);
  });
});
