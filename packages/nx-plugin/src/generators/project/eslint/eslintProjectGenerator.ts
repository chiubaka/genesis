import { Tree, updateJson } from "@nrwl/devkit";
import { Linter } from "eslint";

import { Project } from "../../../utils";
import { EsLintProjectGeneratorSchema } from "./eslintProjectGenerator.schema";

export function eslintProjectGenerator(
  tree: Tree,
  options: EsLintProjectGeneratorSchema,
) {
  const { enableReact, projectName, projectType } = options;
  const project = new Project(tree, projectName, projectType);

  updateJson(
    tree,
    project.path(".eslintrc.json"),
    (eslintConfig: Linter.Config) => {
      eslintConfig.extends = ["../../.eslintrc.json"];
      eslintConfig.ignorePatterns = ["node_modules"];

      eslintConfig.overrides = [];

      const testOverrideFiles = ["jest.config.ts", "*.spec.ts", "*.test.ts"];
      if (enableReact) {
        testOverrideFiles.push("*.spec.tsx", "*.test.tsx");
      }

      const testOverrides = {
        files: testOverrideFiles,
        parserOptions: {
          project: [project.path("tsconfig.spec.json")],
        },
      };
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (tree.exists(project.path("tsconfig.spec.json"))) {
        eslintConfig.overrides.push(testOverrides);
      }

      const storybookOverrides = {
        files: ["*.stories.tsx"],
        parserOptions: {
          project: [project.path(".storybook/tsconfig.json")],
        },
      };

      if (enableReact) {
        eslintConfig.overrides.push(storybookOverrides);
      }

      const typescriptOverrideFiles = ["*.ts"];
      if (enableReact) {
        typescriptOverrideFiles.push("*.tsx");
      }

      let primaryTsConfigPath = project.path(project.getPrimaryTsConfigName());
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (!tree.exists(primaryTsConfigPath)) {
        primaryTsConfigPath = project.path("tsconfig.json");
      }

      const typescriptOverrideExcludedFiles = [];
      if (primaryTsConfigPath !== project.path("tsconfig.json")) {
        typescriptOverrideExcludedFiles.push(
          "jest.config.ts",
          "*.spec.ts",
          "*.test.ts",
        );
        if (enableReact) {
          typescriptOverrideExcludedFiles.push(
            "*.stories.tsx",
            "*.spec.tsx",
            "*.test.tsx",
          );
        }
      }

      const typescriptOverrides = {
        excludedFiles: typescriptOverrideExcludedFiles,
        files: typescriptOverrideFiles,
        parserOptions: {
          project: [primaryTsConfigPath],
        },
      };
      eslintConfig.overrides.push(typescriptOverrides);

      if (enableReact) {
        // react/react-in-jsx-scope is not required since build tools appear to be
        // adding this automagically.
        eslintConfig.overrides.push({
          files: ["*.tsx"],
          rules: {
            "react/react-in-jsx-scope": "off",
          },
        });
      }

      return eslintConfig;
    },
  );
}
