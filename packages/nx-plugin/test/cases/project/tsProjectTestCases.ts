import { Project } from "../../../src";
import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

export const tsProjectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions = {},
) => {
  projectTestCases(getProject, options);
};
