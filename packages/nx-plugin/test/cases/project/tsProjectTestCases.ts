import { Project } from "../../../src";
import { ProjectJsonTestCasesOptions } from "./projectJsonTestCases";
import { projectTestCases } from "./projectTestCases";

interface TsProjectTestCasesOptions {
  projectJson: ProjectJsonTestCasesOptions;
  repoName?: string;
}

export const tsProjectTestCases = (
  getProject: () => Project,
  options: TsProjectTestCasesOptions,
) => {
  projectTestCases(getProject, {
    ...options,
    jest: {
      testEnvironment: "node",
    },
    tsconfig: {
      appLibTypes: [],
      compilerOptions: {
        lib: ["es2015"],
        module: "commonjs",
        target: "es2015",
      },
    },
  });
};
