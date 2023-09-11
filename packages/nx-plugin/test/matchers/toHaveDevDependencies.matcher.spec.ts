import { Tree, writeJson } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

describe("toHaveDevDependencies", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(4).toHaveDevDependencies({ jest: undefined });
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHaveDevDependencies({ jest: undefined });
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json doesn't have a devDependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHaveDevDependencies({ jest: undefined });
    }).toThrow(
      'Expected /virtual/package.json to have a "devDependencies" key',
    );
  });

  it("fails when package.json does not have the specified devDependency", () => {
    writeJson(tree, "package.json", { devDependencies: {} });

    expect(() => {
      expect(tree).toHaveDevDependencies({ jest: undefined });
    }).toThrow(
      "Expected /virtual/package.json to have jest in devDependencies",
    );
  });

  it("fails when package.json has a devDependency with the wrong version", () => {
    writeJson(tree, "package.json", { devDependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHaveDevDependencies({ jest: "1.2.1" });
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.2.1 in devDependencies (received: 1.0.0)",
    );
  });

  it("fails when package.json has some of the specified devDependencies, but not all of them", () => {
    writeJson(tree, "package.json", { devDependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHaveDevDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript in devDependencies",
    );
  });

  it("fails when package.json has some matching dependency versions, but not all of them", () => {
    writeJson(tree, "package.json", {
      devDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDevDependencies({
        jest: "1.0.0",
        typescript: "5.2.1",
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript@5.2.1 in devDependencies (received: 4.7.4)",
    );
  });

  it("passes when package.json has all specified devDependencies", () => {
    writeJson(tree, "package.json", {
      devDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDevDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified devDependencies and versions", () => {
    writeJson(tree, "package.json", {
      devDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDevDependencies({
        jest: "1.0.0",
        typescript: "4.7.4",
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified devDependencies and versions (mixed with no version specification)", () => {
    writeJson(tree, "package.json", {
      devDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDevDependencies({
        jest: "1.0.0",
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", {
      devDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDevDependencies(
        {
          jest: "1.0.0",
          typescript: undefined,
        },
        "app/package.json",
      );
    }).not.toThrow();
  });
});
