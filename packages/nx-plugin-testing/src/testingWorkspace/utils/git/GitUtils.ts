import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class GitUtils {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public async commitAllFiles(message: string) {
    await this.stageAllFiles();
    return this.execGitCommand(`commit -m "${message}"`);
  }

  public getLatestCommitHash() {
    return this.execGitCommand("log --oneline -n -1 --pretty=format:'%H'");
  }

  public getLatestRemoteCommitHash() {
    return this.execGitCommand(
      "log --oneline -n -1 --pretty=format:'%H' $(git branch -r)",
    );
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

  public fetchOriginMaster() {
    return this.execGitCommand("fetch origin master");
  }

  public getRepoRoot() {
    return this.execGitCommand("rev-parse --show-toplevel");
  }

  public async isWorkingDirectoryClean() {
    const gitStatus = await this.execGitCommand("status --porcelain");

    return gitStatus === "";
  }

  public stageAllFiles() {
    return this.execGitCommand("add .");
  }

  public unstageFile(filePath: string) {
    return this.execGitCommand(`restore --staged ${filePath}`);
  }

  private async execGitCommand(command: string) {
    const { stdout } = await this.workspace.exec(`git ${command}`);
    return stdout.trim();
  }
}
