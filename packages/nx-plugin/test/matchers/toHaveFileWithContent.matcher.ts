import { Tree } from "@nrwl/devkit";

interface FileWithContentMatcherOptions {
  exact?: boolean;
}

export function toHaveFileWithContent(
  this: jest.MatcherUtils,
  tree: Tree,
  filePath: string,
  content: string,
  options: FileWithContentMatcherOptions = {},
) {
  expect(tree).toBeNxTree();

  if (!this.isNot) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(filePath)).toBe(true);
  }

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
    if (this.isNot) {
      expect(fileContent).not.toEqual(content);
    } else {
      expect(fileContent).toEqual(content);
    }
  } else {
    if (this.isNot) {
      expect(fileContent).not.toContain(content);
    } else {
      expect(fileContent).toContain(content);
    }
  }

  const defaultResult = !this.isNot;

  return {
    pass: defaultResult,
    message: () => {
      const messagePrefix = this.isNot
        ? "Expected tree NOT to contain"
        : "Expected tree to contain";
      return `${messagePrefix} ${filePath} with content ${content}`;
    },
  };
}
