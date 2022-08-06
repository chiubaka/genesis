import { readFile } from "@nrwl/nx-plugin/testing";

export const fileContents = (
  filePath: string,
  expectedContent: string,
  exact = false,
) => {
  const contents = readFile(filePath);

  if (exact) {
    expect(contents).toBe(expectedContent);
  } else {
    expect(contents).toContain(expectedContent);
  }
};
