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

  public fileContents(relativePath: string, expectedContents, exact = false) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const contents = this.fs.readFile(relativePath);

    if (exact) {
      expect(contents).toBe(expectedContents);
    } else {
      expect(contents).toContain(expectedContents);
    }
  }
}
