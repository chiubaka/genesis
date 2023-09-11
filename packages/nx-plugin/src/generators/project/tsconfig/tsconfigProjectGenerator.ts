import { Tree, writeJson } from "@nx/devkit";

import { TsConfig } from "../../../types";
import { Project } from "../../../utils";
import { TsConfigProjectGeneratorSchema } from "./tsconfigProjectGenerator.schema";

export function tsconfigProjectGenerator(
  tree: Tree,
  options: TsConfigProjectGeneratorSchema,
) {
  const { projectName, projectType, ...tsConfigOptions } = options;
  const project = new Project(tree, projectName, projectType);

  const { primaryConfig, testConfig, baseConfig } = tsConfigOptions;

  const reactEnabled = baseConfig?.compilerOptions?.jsx !== undefined;

  tree.delete(project.path("tsconfig.json"));
  tree.delete(project.path("tsconfig.app.json"));
  tree.delete(project.path("tsconfig.lib.json"));
  tree.delete(project.path("tsconfig.spec.json"));

  writeBaseConfig(project, baseConfig);
  writePrimaryConfig(project, primaryConfig, reactEnabled);
  writeTestConfig(project, testConfig, reactEnabled);
}

function writeBaseConfig(project: Project, baseConfig: TsConfig = {}) {
  const tree = project.getTree();
  const primaryConfigName = project.getPrimaryTsConfigName();

  writeJson<TsConfig>(tree, project.path("tsconfig.json"), {
    extends: "../../tsconfig.base.json",
    ...baseConfig,
    compilerOptions: {
      outDir: "../../dist/out-tsc",
      ...baseConfig.compilerOptions,
    },
    files: baseConfig.files || [],
    include: baseConfig.include || [],
    references: [
      {
        path: `./${primaryConfigName}`,
      },
      {
        path: "./tsconfig.spec.json",
      },
      ...(baseConfig.references || []),
    ],
  });
}

function writePrimaryConfig(
  project: Project,
  primaryConfig: TsConfig = {},
  reactEnabled: boolean,
) {
  const tree = project.getTree();
  const primaryConfigName = project.getPrimaryTsConfigName();

  const include = [...(primaryConfig.include || []), "**/*.ts"];
  if (reactEnabled) {
    include.push("**/*.tsx");
  }

  const exclude = [
    ...(primaryConfig.exclude || []),
    "jest.config.ts",
    "**/*.spec.ts",
    "**/*.test.ts",
  ];
  if (reactEnabled) {
    exclude.push("**/*.spec.tsx", "**/*.test.tsx");
  }
  exclude.push("test");

  writeJson<TsConfig>(tree, project.path(primaryConfigName), {
    extends: "./tsconfig.json",
    ...primaryConfig,
    compilerOptions: {
      declaration: true,
      ...primaryConfig?.compilerOptions,
    },
    include,
    exclude,
  });
}

function writeTestConfig(
  project: Project,
  testConfig: TsConfig = {},
  reactEnabled: boolean,
) {
  const tree = project.getTree();

  const include = [
    ...(testConfig.include || []),
    "jest.config.ts",
    "**/*.spec.ts",
    "**/*.test.ts",
  ];
  if (reactEnabled) {
    include.push("**/*.spec.tsx", "**/*.test.tsx");
  }
  include.push("**/*.d.ts", "test");

  writeJson<TsConfig>(tree, project.path("tsconfig.spec.json"), {
    extends: "./tsconfig.json",
    ...testConfig,
    compilerOptions: {
      types: ["jest", "node"],
      ...testConfig.compilerOptions,
    },
    include,
  });
}
