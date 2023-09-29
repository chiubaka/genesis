import { toBeNxTree } from "./toBeNxTree.matcher";
import { toHaveDependencies } from "./toHaveDependencies.matcher";
import { toHaveDependency } from "./toHaveDependency.matcher";
import { toHaveDevDependencies } from "./toHaveDevDependencies.matcher";
import { toHaveDevDependency } from "./toHaveDevDependency.matcher";
import { toHaveFileWithContent } from "./toHaveFileWithContent.matcher";
import { toHaveFunctions } from "./toHaveFunctions.matcher";
import { toHavePeerDependencies } from "./toHavePeerDependencies.matcher";
import { toHavePeerDependency } from "./toHavePeerDependency.matcher";
import { toHaveProperties } from "./toHaveProperties.matcher";
import { toHaveRenamedFile } from "./toHaveRenamedFile.matcher";

export const matchers: jest.ExpectExtendMap = {
  toBeNxTree,
  toHaveDependencies,
  toHaveDependency,
  toHaveDevDependencies,
  toHaveDevDependency,
  toHaveFileWithContent,
  toHaveFunctions,
  toHavePeerDependencies,
  toHavePeerDependency,
  toHaveProperties,
  toHaveRenamedFile,
};
