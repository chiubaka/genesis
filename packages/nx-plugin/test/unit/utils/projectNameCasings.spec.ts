import { projectNameCasings, ProjectNames } from "../../../src";

describe("projectNameCasings", () => {
  describe("when input is in camelCase", () => {
    casingTests(projectNameCasings("nodeLib"));
  });

  describe("when input is in kebab-case", () => {
    casingTests(projectNameCasings("node-lib"));
  });

  describe("when input is in PascalCase", () => {
    casingTests(projectNameCasings("NodeLib"));
  });
});

function casingTests(projectNames: ProjectNames) {
  it("creates the correct camelCase name", () => {
    expect(projectNames.camelCase).toBe("nodeLib");
  });

  it("creates the correct kebab-case name", () => {
    expect(projectNames.kebabCase).toBe("node-lib");
  });

  it("creates the correct PascalCase name", () => {
    expect(projectNames.pascalCase).toBe("NodeLib");
  });
}
