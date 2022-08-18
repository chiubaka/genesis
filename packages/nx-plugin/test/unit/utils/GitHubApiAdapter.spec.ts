jest.unmock("octokit");

import nock from "nock";
import path from "node:path";

import { github } from "../../../src/utils";

describe("GitHubApiAdapter", () => {
  const TEST_REPO = {
    owner: "chiubaka",
    name: "test-repo",
    description: "Test generated repo",
    isPrivate: true,
  };
  const TEST_LABEL = {
    repoOwner: "chiubaka",
    repoName: "generated-typescript-package",
    name: "foobar",
    description: "Test description",
    color: "000000",
  };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe("#createOrUpdateRepo", () => {
    describe("when there is no existing repo", () => {
      beforeEach(() => {
        loadGitHubNockScope("createOrUpdateRepo.nock.json");
      });

      it("creates one", async () => {
        const repo = await github.createOrUpdateRepo(TEST_REPO);

        expect(repo.name).toEqual(TEST_REPO.name);
        expect(repo.description).toEqual(TEST_REPO.description);
        expect(repo.isPrivate).toEqual(TEST_REPO.isPrivate);
      });
    });

    describe("when there is an existing repo", () => {
      beforeEach(() => {
        loadGitHubNockScope("createOrUpdateRepoExisting.nock.json");
      });

      it("updates the existing repo", async () => {
        const repo = await github.createOrUpdateRepo({
          ...TEST_REPO,
          description: "Updated description",
          allowAutoMerge: true,
          allowMergeCommit: false,
          allowRebaseMerge: true,
          allowSquashMerge: true,
        });

        expect(repo.description).toBe("Updated description");
        expect(repo.allowAutoMerge).toBe(true);
        expect(repo.allowMergeCommit).toBe(false);
        expect(repo.allowRebaseMerge).toBe(true);
        expect(repo.allowSquashMerge).toBe(true);
      });
    });
  });

  describe("#createOrUpdateLabel", () => {
    describe("when the label doesn't already exist", () => {
      beforeEach(() => {
        loadGitHubNockScope("createOrUpdateLabel.nock.json");
      });

      it("creates a new label", async () => {
        const response = await github.createOrUpdateLabel(TEST_LABEL);

        const { status, data } = response;

        expect(status).toBe(201);
        expect(data.name).toBe(TEST_LABEL.name);
        expect(data.description).toBe(TEST_LABEL.description);
        expect(data.color).toBe(TEST_LABEL.color);
      });
    });

    describe("when the label already exists", () => {
      beforeEach(() => {
        loadGitHubNockScope("createOrUpdateLabelExisting.nock.json");
      });

      it("updates the existing label", async () => {
        const response = await github.createOrUpdateLabel({
          ...TEST_LABEL,
          description: "Updated description",
        });

        const { status, data } = response;

        expect(status).toBe(200);
        expect(data.description).toBe("Updated description");
      });
    });
  });

  describe("#deleteLabel", () => {
    describe("when the label exists", () => {
      beforeEach(() => {
        loadGitHubNockScope("deleteLabelExisting.nock.json");
      });

      it("deletes an existing label", async () => {
        const response = await github.deleteLabel(
          TEST_LABEL.repoOwner,
          TEST_LABEL.repoName,
          TEST_LABEL.name,
        );

        expect(response).toBeDefined();

        const { status, data } = response as { status: number; data: never };

        expect(status).toBe(204);
        expect(data).toBeUndefined();
      });
    });

    describe("when the label does not exist", () => {
      beforeEach(() => {
        loadGitHubNockScope("deleteLabel.nock.json");
      });

      it("returns nothing", async () => {
        const response = await github.deleteLabel(
          TEST_LABEL.repoOwner,
          TEST_LABEL.repoName,
          TEST_LABEL.name,
        );

        expect(response).toBeUndefined();
      });
    });
  });

  describe("#updateBranchProtection", () => {
    beforeEach(() => {
      loadGitHubNockScope("updateBranchProtection.nock.json");
    });

    it("successfully updates branch protection", async () => {
      const response = await github.updateBranchProtection({
        repoOwner: TEST_REPO.owner,
        repoName: TEST_REPO.name,
        branch: "master",
        requiredLinearHistory: true,
        requiredConversationResolution: true,
      });

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data).toBe("");
    });
  });

  describe("#createCommitSignatureProtection", () => {
    beforeEach(() => {
      loadGitHubNockScope("createCommitSignatureProtection.nock.json");
    });

    it("successfully enables commit signature protection", async () => {
      const response = await github.createCommitSignatureProtection(
        TEST_REPO.owner,
        TEST_REPO.name,
        "master",
      );

      const { status, data } = response;

      expect(status).toBe(200);
      expect(data).toEqual({
        enabled: true,
        url: `https://api.github.com/repos/${TEST_REPO.owner}/${TEST_REPO.name}/branches/master/protection/required_signatures`,
      });
    });
  });

  describe("#enableVulnerabilityAlerts", () => {
    beforeEach(() => {
      loadGitHubNockScope("enableVulnerabilityAlerts.nock.json");
    });

    it("successfully enables vulnerability alerts", async () => {
      const response = await github.enableVulnerabilityAlerts(
        TEST_REPO.owner,
        TEST_REPO.name,
      );

      const { status, data } = response;

      expect(status).toBe(204);
      expect(data).toBeUndefined();
    });
  });
});

const loadGitHubNockScope = (fileName: string) => {
  nock.load(path.join(__dirname, `../../fixtures/nock/github/${fileName}`));
};
