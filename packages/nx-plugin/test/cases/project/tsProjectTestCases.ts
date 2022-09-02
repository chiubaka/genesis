import { Project } from "../../../src";
import { eslintProjectTestCases } from "./eslintProjectTestCases";
import { jestProjectTestCases } from "./jestProjectTestCases";
import {
  projectJsonTestCases,
  ProjectJsonTestCasesOptions,
} from "./projectJsonTestCases";
import { projectTestCases } from "./projectTestCases";
import { readmeProjectTestCases } from "./readmeProjectTestCases";
import { tsconfigTestCases } from "./tsconfigTestCases";

interface TsProjectTestCasesOptions {
  projectJson: ProjectJsonTestCasesOptions;
  repoName?: string;
}

export const tsProjectTestCases = (
  getProject: () => Project,
  options: TsProjectTestCasesOptions,
) => {
  projectTestCases(getProject, options.repoName);
  projectJsonTestCases(getProject, options.projectJson);
  jestProjectTestCases(getProject, "node");
  tsconfigTestCases(getProject, {
    appLibTypes: [],
    compilerOptions: {
      lib: ["es2015"],
      module: "commonjs",
      target: "es2015",
    },
  });
  eslintProjectTestCases(getProject);
  readmeProjectTestCases(getProject, options.repoName);
};
