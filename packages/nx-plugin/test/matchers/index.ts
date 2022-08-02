import { toBeNxTree } from "./toBeNxTree.matcher";
import { toHaveDependencies } from "./toHaveDependencies.matcher";
import { toHaveDependency } from "./toHaveDependency.matcher";
import { toHaveDevDependencies } from "./toHaveDevDependencies.matcher";
import { toHaveDevDependency } from "./toHaveDevDependency.matcher";
import { toHaveFunctions } from "./toHaveFunctions.matcher";
import { toHaveProperties } from "./toHaveProperties.matcher";

export const matchers: jest.ExpectExtendMap = {
  toBeNxTree,
  toHaveDependencies,
  toHaveDependency,
  toHaveDevDependencies,
  toHaveDevDependency,
  toHaveFunctions,
  toHaveProperties,
};
