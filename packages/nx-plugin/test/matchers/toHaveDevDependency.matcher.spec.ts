import { Tree, writeJson } from "@nrwl/devkit";
import { createTree } from "@nrwl/devkit/testing";

describe("toHaveDevDependency", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(2).toHaveDevDependency("jest");
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHaveDevDependency("jest");
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json does not have a devDependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHaveDevDependency("jest");
    }).toThrow(
      'Expected /virtual/package.json to have a "devDependencies" key',
    );
  });

  it("fails when the specified dependency doesn't exist in package.json", () => {
    writeJson(tree, "package.json", { devDependencies: {} });

    expect(() => {
      expect(tree).toHaveDevDependency("jest");
    }).toThrow(
      "Expected /virtual/package.json to have jest in devDependencies",
    );
  });

  it("fails when the specified dependency has the wrong version in package.json", () => {
    writeJson(tree, "package.json", { devDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDevDependency("jest", "1.0.0");
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.0.0 in devDependencies (received: 1.2.1)",
    );
  });

  it("passes when the specified dependency exists in package.json", () => {
    writeJson(tree, "package.json", { devDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDevDependency("jest");
    }).not.toThrow();
  });

  it("passes when the specified dependency and version exists in package.json", () => {
    writeJson(tree, "package.json", { devDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDevDependency("jest", "1.2.1");
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", { devDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDevDependency("jest", "1.2.1", "app/package.json");
    }).not.toThrow();
  });
});
