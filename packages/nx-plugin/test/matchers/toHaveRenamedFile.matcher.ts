import { Tree } from "@nx/devkit";

export function toHaveRenamedFile(
  this: jest.MatcherUtils,
  tree: Tree,
  oldPath: string,
  newPath: string,
): jest.CustomMatcherResult {
  expect(tree).toBeNxTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  expect(tree.exists(oldPath)).toBe(false);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  expect(tree.exists(newPath)).toBe(true);

  return {
    pass: true,
    message: () => {
      return `Expected ${oldPath} to have been renamed to ${newPath}`;
    },
  };
}
