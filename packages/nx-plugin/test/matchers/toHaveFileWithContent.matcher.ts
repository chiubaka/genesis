import { Tree } from "@nrwl/devkit";

interface FileWithContentMatcherOptions {
  exact?: boolean;
}

export const toHaveFileWithContent = (
  tree: Tree,
  filePath: string,
  content: string,
  options: FileWithContentMatcherOptions = {},
) => {
  expect(tree).toBeNxTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  expect(tree.exists(filePath)).toBe(true);

  const buffer = tree.read(filePath);

  if (!buffer) {
    return {
      pass: false,
      message: () => {
        return `Unexpectedly received null when attempting to read ${filePath}`;
      },
    };
  }

  const fileContent = buffer.toString();

  if (options.exact) {
    expect(fileContent).toEqual(content);
  } else {
    expect(fileContent).toContain(content);
  }

  return {
    pass: true,
    message: () => {
      return `Expected tree to contain ${filePath} with content ${content}`;
    },
  };
};
