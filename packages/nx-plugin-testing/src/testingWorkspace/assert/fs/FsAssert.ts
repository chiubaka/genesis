import { FsUtils } from "../../utils/fs";

export class FsAssert {
  private fs: FsUtils;

  constructor(fs: FsUtils) {
    this.fs = fs;
  }

  public exists(relativePath: string) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(this.fs.exists(relativePath)).toBe(true);
  }

  public notExists(relativePath: string) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(this.fs.exists(relativePath)).toBe(false);
  }

  public hasChildDirectories(
    relativePath: string,
    expectedChildDirectoryNames: string[],
  ) {
    const allChildren = this.fs.children(relativePath);

    const childDirectories = allChildren.filter((child) => {
      return child.isDirectory();
    });

    const childDirectoryNames = childDirectories.map(
      (childDirectory) => childDirectory.name,
    );

    expect(childDirectoryNames).toEqual(expectedChildDirectoryNames);
  }

  public fileContents(
    relativePath: string,
    expectedContents: string,
    exact = false,
  ) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = this.fs.readFile(relativePath);

    if (exact) {
      expect(contents).toBe(expectedContents);
    } else {
      expect(contents).toContain(expectedContents);
    }
  }

  public jsonFileContents<TJson>(relativePath: string, object: Partial<TJson>) {
    const json = this.fs.readJsonFile(relativePath);

    expect(json).toMatchObject(object);
  }
}
