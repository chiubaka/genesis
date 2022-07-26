import { readProjectConfiguration, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import generator from "./generator";
import { PresetGeneratorSchema } from "./schema";

describe("preset generator", () => {
  let appTree: Tree;
  const options: PresetGeneratorSchema = { name: "test" };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, "test");

    expect(config).toBeDefined();
  });
});
