import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, reactAppGenerator } from "../../../../src";
import {
  fileMatchesSnapshot,
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

  describe("workspace", () => {
    describe("storybook", () => {
      fileMatchesSnapshot(".storybook/main.ts", getProject);
    });
  });

  describe("sample code", () => {
    it("generates an App directory", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("App"))).toBe(true);
    });

    it("generates an assets directory", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("assets"))).toBe(true);
    });

    it("generates an environments directory", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("environments"))).toBe(true);
    });

    it("generates a favicon", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("favicon.ico"))).toBe(true);
    });

    fileMatchesSnapshot("index.html", getProject, (project: Project) =>
      project.srcPath("index.html"),
    );

    fileMatchesSnapshot("main.tsx", getProject, (project: Project) =>
      project.srcPath("main.tsx"),
    );

    fileMatchesSnapshot("polyfills.ts", getProject, (project: Project) =>
      project.srcPath("polyfills.ts"),
    );

    fileMatchesSnapshot("styles.scss", getProject, (project: Project) =>
      project.srcPath("styles.scss"),
    );

    describe("generates a sample component", () => {
      fileMatchesSnapshot("App/index.ts", getProject, (project: Project) =>
        project.srcPath("App/index.ts"),
      );

      fileMatchesSnapshot("App/App.tsx", getProject, (project: Project) =>
        project.srcPath("App/App.tsx"),
      );

      fileMatchesSnapshot(
        "App/App.module.scss",
        getProject,
        (project: Project) => project.srcPath("App/App.module.scss"),
      );

      fileMatchesSnapshot(
        "App/App.stories.tsx",
        getProject,
        (project: Project) => project.srcPath("App/App.stories.tsx"),
      );

      fileMatchesSnapshot("App/NxWelcome.tsx", getProject, (project: Project) =>
        project.srcPath("App/NxWelcome.tsx"),
      );

      fileMatchesSnapshot(
        "App/NxWelcome.stories.tsx",
        getProject,
        (project: Project) => project.srcPath("App/NxWelcome.stories.tsx"),
      );
    });

    describe("generates a sample unit test", () => {
      fileMatchesSnapshot("unit/App.spec.tsx", getProject, (project: Project) =>
        project.testPath("unit/App.spec.tsx"),
      );
    });

    describe("environments", () => {
      fileMatchesSnapshot(
        "environments/environment.ts",
        getProject,
        (project: Project) => project.srcPath("environments/environment.ts"),
      );

      fileMatchesSnapshot(
        "environments/environment.prod.ts",
        getProject,
        (project: Project) =>
          project.srcPath("environments/environment.prod.ts"),
      );
    });
  });

  describe("E2E project", () => {
    reactE2eProjectTestCases(getE2eProject);

    describe("sample tests", () => {
      fileMatchesSnapshot("e2e/App.cy.ts", getE2eProject, (project: Project) =>
        project.srcPath("e2e/App.cy.ts"),
      );

      fileMatchesSnapshot(
        "e2e/App/App.cy.ts",
        getE2eProject,
        (project: Project) => project.srcPath("e2e/App/App.cy.ts"),
      );

      fileMatchesSnapshot(
        "e2e/NxWelcome/NxWelcome.cy.ts",
        getE2eProject,
        (project: Project) => project.srcPath("e2e/NxWelcome/NxWelcome.cy.ts"),
      );
    });
  });
});
