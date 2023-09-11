import { Tree } from "@nx/devkit";
import escapeRegExpString from "escape-string-regexp";

export function replaceInFile(
  tree: Tree,
  filePath: string,
  searchValue: string,
  replaceValue: string,
) {
  let contents = tree.read(filePath)?.toString();

  if (contents === undefined) {
    throw new Error(`Failed to read file ${filePath}`);
  }

  // eslint-disable-next-line security/detect-non-literal-regexp
  const pattern = new RegExp(escapeRegExpString(searchValue), "g");
  contents = contents.replace(pattern, replaceValue);

  tree.write(filePath, contents);
}
