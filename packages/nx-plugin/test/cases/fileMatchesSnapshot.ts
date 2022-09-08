import { Tree } from "@nrwl/devkit";

import { Project } from "../../src";

export function fileMatchesSnapshot(
  fileName: string,
  getProject: () => Project,
  getFilePath?: (project: Project) => string,
) {
  let tree: Tree;
  let filePath: string;

  beforeAll(() => {
    const project = getProject();
    tree = project.getTree();

    filePath = getFilePath !== undefined ? getFilePath(project) : fileName;
  });

  it(`generates ${fileName}`, () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(filePath)).toBe(true);
  });

  describe(`${fileName}`, () => {
    it("matches snapshot", () => {
      const contents = tree.read(filePath)?.toString();

      expect(contents).toMatchSnapshot();
    });
  });
}
