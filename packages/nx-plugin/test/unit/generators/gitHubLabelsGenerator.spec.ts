import { parseRemoteUrl } from "../../../src/generators/git/github/labels";

describe("parseRemoteUrl", () => {
  it("correctly parses a simple GitHub remote URL", () => {
    const { organization, repositoryName } = parseRemoteUrl(
      "git@github.com:chiubaka/.genesis-test-github-e2e.git",
    );

    expect(organization).toBe("chiubaka");
    expect(repositoryName).toBe(".genesis-test-github-e2e");
  });
});
