import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class GitUtils {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public getLatestCommitterEmail() {
    return this.execGitCommand("log --oneline -n 1 --pretty=format:'%ae'");
  }

  public getLatestCommitterName() {
    return this.execGitCommand("log --oneline -n 1 --pretty=format:'%an'");
  }

  public async getLatestCommitMessage() {
    const commitDescriptor = await this.execGitCommand("log --oneline -n 1");

    // Remove the first token of the output, which is the short commit hash
    const tokens = commitDescriptor.split(" ");
    tokens.shift();
    const commitMessage = tokens.join(" ");

    return commitMessage;
  }

  public getRepoRoot() {
    return this.execGitCommand("rev-parse --show-toplevel");
  }

  public async isWorkingDirectoryClean() {
    const gitStatus = await this.execGitCommand("status --porcelain");

    return gitStatus === "";
  }

  private async execGitCommand(command: string) {
    const { stdout } = await this.workspace.exec(`git ${command}`);
    return stdout.trim();
  }
}
