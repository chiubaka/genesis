import { Project } from "../../../src";
import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

export const reactProjectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions,
) => {
  projectTestCases(getProject, {
    ...options,
    jest: {
      testEnvironment: "jsdom",
    },
    tsconfig: {
      appLibTypes: [],
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        module: "esnext",
        target: "es5",

        jsx: "react-jsx",
      },
    },
  });
};
