import { Tree, writeJson } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

describe("toHaveDependency", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(2).toHaveDependency("jest");
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHaveDependency("jest");
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json does not have a dependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHaveDependency("jest");
    }).toThrow('Expected /virtual/package.json to have a "dependencies" key');
  });

  it("fails when the specified dependency doesn't exist in package.json", () => {
    writeJson(tree, "package.json", { dependencies: {} });

    expect(() => {
      expect(tree).toHaveDependency("jest");
    }).toThrow("Expected /virtual/package.json to have jest in dependencies");
  });

  it("fails when the specified dependency has the wrong version in package.json", () => {
    writeJson(tree, "package.json", { dependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDependency("jest", "1.0.0");
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.0.0 in dependencies (received: 1.2.1)",
    );
  });

  it("passes when the specified dependency exists in package.json", () => {
    writeJson(tree, "package.json", { dependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDependency("jest");
    }).not.toThrow();
  });

  it("passes when the specified dependency and version exists in package.json", () => {
    writeJson(tree, "package.json", { dependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDependency("jest", "1.2.1");
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", { dependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHaveDependency("jest", "1.2.1", "app/package.json");
    }).not.toThrow();
  });
});
