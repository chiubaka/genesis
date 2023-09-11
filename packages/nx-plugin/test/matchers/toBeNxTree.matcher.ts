import { Tree } from "@nx/devkit";

import { toHaveFunctions } from "./toHaveFunctions.matcher";
import { toHaveProperties } from "./toHaveProperties.matcher";

export const toBeNxTree: jest.CustomMatcher = (tree: Tree) => {
  const results: jest.CustomMatcherResult[] = [];
  results.push(
    toHaveProperties(tree, ["root"]),
    toHaveFunctions(tree, [
      "read",
      "write",
      "exists",
      "delete",
      "rename",
      "isFile",
      "children",
      "listChanges",
      "changePermissions",
    ]),
  );

  let pass = true;
  let message = `Expected value to be an Nx Tree`;

  for (const result of results) {
    if (!result.pass) {
      pass = false;
      message = `${message}: ${result.message()}`;
      break;
    }
  }

  return {
    pass,
    message: () => {
      return message;
    },
  };
};
