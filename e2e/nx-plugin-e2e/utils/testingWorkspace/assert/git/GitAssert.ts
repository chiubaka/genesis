import { GitUtils } from "../../utils/git";

export class GitAssert {
  private git: GitUtils;

  constructor(git: GitUtils) {
    this.git = git;
  }

  public async latestCommitMessage(expectedMessage: string) {
    const commitMessage = await this.git.getLatestCommitMessage();

    expect(commitMessage).toBe(expectedMessage);
  }

  public async latestCommitterEmail(expectedEmail: string) {
    const committerEmail = await this.git.getLatestCommitterEmail();

    expect(committerEmail).toBe(expectedEmail);
  }

  public async latestCommitterName(expectedName: string) {
    const committerName = await this.git.getLatestCommitterName();

    expect(committerName).toBe(expectedName);
  }

  public async isRepoRoot(expectedRepoRoot: string) {
    const repoRoot = await this.git.getRepoRoot();

    expect(repoRoot).toBe(expectedRepoRoot);
  }

  public async workingDirectoryIsClean() {
    const clean = await this.git.isWorkingDirectoryClean();

    expect(clean).toBe(true);
  }
}
