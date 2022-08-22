/* eslint-disable security/detect-non-literal-fs-filename */

import {
  getWorkspaceLayout,
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import path from "node:path";
import { CompilerOptions, ProjectReference } from "typescript";
("ts-jest");

import { nodeLibGenerator } from "../../../../src/generators";
import { TsConfig } from "../../../types/tsconfig";

describe("nodeLibGenerator", () => {
  let tree: Tree;

  let projectPath: (relativePath?: string) => string;
  let srcPath: (relativePath?: string) => string;
  let testPath: (relativePath?: string) => string;

  let jestConfigPath: string;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await nodeLibGenerator(tree, {
      name: "node-lib",
      scope: "chiubaka",
      publishable: true,
    });

    const { libsDir } = getWorkspaceLayout(tree);
    projectPath = (relativePath = "") => {
      return path.join(libsDir, "node-lib", relativePath);
    };

    srcPath = (relativePath = "") => {
      return path.join(projectPath("src"), relativePath);
    };

    testPath = (relativePath = "") => {
      return path.join(projectPath("test"), relativePath);
    };

    jestConfigPath = projectPath("jest.config.ts");
  });

  it("generates a directory for the new package", () => {
    expect(tree.exists(projectPath())).toBe(true);
  });

  describe("workspace configurations", () => {
    describe("workspace.json", () => {
      it.todo(
        "updates projects to include a path to the newly generated package",
      );
    });

    describe("tsconfig.base.json", () => {
      it.todo("updates paths to point to the newly generated package");
    });
  });

  it("generates a separate test dir", () => {
    expect(tree.exists(testPath())).toBe(true);
  });

  it("generates a sample unit test file in pascal case", () => {
    expect(tree.exists(testPath("unit/hello.spec.ts"))).toBe(true);
  });

  it("generates a sample file in pascal case", () => {
    expect(tree.exists(srcPath("hello.ts"))).toBe(true);
  });

  it("generates a jest config", () => {
    expect(tree.exists(jestConfigPath)).toBe(true);
  });

  describe("jest.config.ts", () => {
    it("does not have an eslint-disable directive", () => {
      expect(tree).not.toHaveFileWithContent(
        projectPath("jest.config.ts"),
        "/* eslint-disable */",
      );
    });

    it("uses the project's kebab-case name as the displayName", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'displayName: "node-lib"',
      );
    });

    it("inherits from the base workspace preset", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'preset: "../../jest.preset.js"',
      );
    });

    it("uses ts-jest to transform ts and js files", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        '"^.+\\\\.[tj]s$": "ts-jest"',
      );
    });

    it("allows ts, js, and html files as modules", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'moduleFileExtensions: ["ts", "js", "html"]',
      );
    });

    it("outputs coverage reports to the base workspace reports directory", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'coverageDirectory: "../../reports/coverage/packages/node-lib"',
      );
    });

    it("configures the jest-junit reporter for CircleCI test tab compatibility", () => {
      expect(tree).toHaveFileWithContent(jestConfigPath, "jest-junit");
    });
  });

  describe("tsconfig.json", () => {
    it("generates a tsconfig.json file", () => {
      expect(tree.exists(projectPath("tsconfig.json"))).toBe(true);
    });

    describe("generates a minimal tsconfig.json file", () => {
      let tsConfig: TsConfig;

      beforeAll(() => {
        tsConfig = readJson<TsConfig>(tree, projectPath("tsconfig.json"));
      });

      it("extends from the workspace base tsconfig file", () => {
        expect(tsConfig.extends).toBe("../../tsconfig.base.json");
      });

      it("includes a minimal set of compilerOptions", () => {
        expect(tsConfig.compilerOptions).toBeDefined();

        const compilerOptions = tsConfig.compilerOptions as CompilerOptions;

        expect(Object.keys(compilerOptions)).toHaveLength(2);
        expect(compilerOptions.module).toBe("commonjs");
        expect(compilerOptions.outDir).toBe("../../dist/out-tsc");
      });

      it("references child configs for build and testing", () => {
        expect(tsConfig.references).toBeDefined();

        const references = tsConfig.references as ProjectReference[];

        expect(references).toHaveLength(2);
        expect(references[0]).toEqual({
          path: "./tsconfig.lib.json",
        });
        expect(references[1]).toEqual({
          path: "./tsconfig.spec.json",
        });
      });
    });
  });

  describe("tsconfig.lib.json", () => {
    let tsConfig: TsConfig;

    beforeAll(() => {
      tsConfig = readJson<TsConfig>(tree, projectPath("tsconfig.lib.json"));
    });

    it("extends from the main project tsconfig file", () => {
      expect(tsConfig.extends).toBe("./tsconfig.json");
    });

    describe("compilerOptions", () => {
      let compilerOptions: CompilerOptions | undefined;

      beforeAll(() => {
        compilerOptions = tsConfig.compilerOptions;
      });

      it("does not specify outDir", () => {
        expect(compilerOptions?.outDir).toBeUndefined();
      });

      it("does not specify module", () => {
        expect(compilerOptions?.module).toBeUndefined();
      });

      it("ensures that declarations are output", () => {
        expect(compilerOptions?.declaration).toBe(true);
      });
    });
  });

  describe("tsconfig.spec.json", () => {
    let tsConfig: TsConfig;

    beforeAll(() => {
      tsConfig = readJson<TsConfig>(tree, projectPath("tsconfig.spec.json"));
    });

    it("extends from the main project tsconfig file", () => {
      expect(tsConfig.extends).toBe("./tsconfig.json");
    });

    describe("compilerOptions", () => {
      let compilerOptions: CompilerOptions | undefined;

      beforeAll(() => {
        compilerOptions = tsConfig.compilerOptions;
      });

      it("does not specify outDir", () => {
        expect(compilerOptions?.outDir).toBeUndefined();
      });

      it("does not specify module", () => {
        expect(compilerOptions?.module).toBeUndefined();
      });

      it("ensures jest and node typings are included", () => {
        expect(compilerOptions?.types).toBeDefined();

        const types = compilerOptions?.types as string[];

        expect(types).toContain("jest");
        expect(types).toContain("node");
      });
    });
  });

  it("generates a README.md file", () => {
    expect(tree.exists(projectPath("README.md"))).toBe(true);
  });

  describe("README.md", () => {
    it("includes the project name as the title", () => {
      expect(tree).toHaveFileWithContent(
        projectPath("README.md"),
        "# node-lib",
      );
    });

    describe("shields", () => {
      it("generates an NPM package version shield", () => {
        expect(tree).toHaveFileWithContent(
          projectPath("README.md"),
          `[![npm](https://img.shields.io/npm/v/@chiubaka/node-lib)](https://www.npmjs.com/package/@chiubaka/node-lib)`,
        );
      });

      it("generates a Codecov shield for just the flag matching this project", () => {
        expect(tree).toHaveFileWithContent(
          projectPath("README.md"),
          `[![codecov](https://codecov.io/gh/chiubaka/node-lib/branch/master/graph/badge.svg?token=foobar&flag=nx-plugin)](https://codecov.io/gh/chiubaka/node-lib)`,
        );
      });
    });
  });

  it("generates a project.json file", () => {
    expect(tree.exists(projectPath("project.json"))).toBe(true);
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson<ProjectConfiguration>(
        tree,
        projectPath("project.json"),
      );
    });

    describe("targets", () => {
      let targets: Record<string, TargetConfiguration> | undefined;

      beforeAll(() => {
        targets = projectJson.targets;
      });

      it("includes a lint target", () => {
        expect(targets?.lint).toBeDefined();
      });

      it("includes a test target", () => {
        expect(targets?.test).toBeDefined();
      });

      it("includes a build target", () => {
        expect(targets?.build).toBeDefined();
      });
    });
  });
});
/* eslint-enable security/detect-non-literal-fs-filename */
