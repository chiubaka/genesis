import { Project } from "../../../src";
import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

export const tsProjectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions,
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
