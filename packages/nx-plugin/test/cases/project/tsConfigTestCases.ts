import { readJson, Tree } from "@nrwl/devkit";
import { ProjectReference } from "typescript";

import { Project } from "../../../src";
import { CompilerOptions, TsConfig } from "../../types/tsconfig";

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  outDir: "../../dist/out-tsc",
};

export const tsConfigTestCases = (
  getProject: () => Project,
  expectedCompilerOptions: CompilerOptions = {},
) => {
  let project: Project;
  let tree: Tree;

  let primaryTsConfigName: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();

    primaryTsConfigName =
      project.getType() === "application"
        ? "tsconfig.app.json"
        : "tsconfig.lib.json";
  });

  describe("tsconfig.json", () => {
    it("generates a tsconfig.json file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path("tsconfig.json"))).toBe(true);
    });

    describe("generates a minimal tsconfig.json file", () => {
      let tsConfig: TsConfig;

      beforeAll(() => {
        tsConfig = readJson<TsConfig>(tree, project.path("tsconfig.json"));
      });

      it("extends from the workspace base tsconfig file", () => {
        expect(tsConfig.extends).toBe("../../tsconfig.base.json");
      });

      it("includes a minimal set of compilerOptions", () => {
        expect(tsConfig.compilerOptions).toBeDefined();

        const compilerOptions = tsConfig.compilerOptions as CompilerOptions;

        const mergedExpectedOptions = {
          ...DEFAULT_COMPILER_OPTIONS,
          ...expectedCompilerOptions,
        };

        expect(Object.keys(compilerOptions)).toHaveLength(
          Object.keys(mergedExpectedOptions).length,
        );
        expect(compilerOptions).toMatchObject({
          ...DEFAULT_COMPILER_OPTIONS,
          ...expectedCompilerOptions,
        });
      });

      it("references child configs for build and testing", () => {
        expect(tsConfig.references).toBeDefined();

        const references = tsConfig.references as ProjectReference[];

        expect(references).toHaveLength(2);
        expect(references[0]).toEqual({
          path: `./${primaryTsConfigName}`,
        });
        expect(references[1]).toEqual({
          path: "./tsconfig.spec.json",
        });
      });
    });
  });

  describe(
    () => {
      return primaryTsConfigName;
    },
    () => {
      let tsConfig: TsConfig;

      beforeAll(() => {
        tsConfig = readJson<TsConfig>(tree, project.path(primaryTsConfigName));
      });

      it("extends from the main project tsconfig file", () => {
        expect(tsConfig.extends).toBe("./tsconfig.json");
      });

      it("excludes the test directory", () => {
        expect(tsConfig.exclude).toContain("test");
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

        it("ensures node typings are included", () => {
          expect(compilerOptions?.types).toContain("node");
        });
      });
    },
  );

  describe("tsconfig.spec.json", () => {
    let tsConfig: TsConfig;

    beforeAll(() => {
      tsConfig = readJson<TsConfig>(tree, project.path("tsconfig.spec.json"));
    });

    it("extends from the main project tsconfig file", () => {
      expect(tsConfig.extends).toBe("./tsconfig.json");
    });

    it("includes the test directory", () => {
      expect(tsConfig.include).toContain("test");
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
};
