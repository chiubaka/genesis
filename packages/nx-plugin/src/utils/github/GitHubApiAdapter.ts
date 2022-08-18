import { Octokit } from "octokit";

interface GitHubResponse {
  status: number;
}

interface GitHubRepo {
  owner: {
    login: string;
  };
  name: string;
  description: string | null;
  allow_auto_merge?: boolean;
  allow_merge_commit?: boolean;
  allow_rebase_merge?: boolean;
  allow_squash_merge?: boolean;
  allow_update_branch?: boolean;
  delete_branch_on_merge?: boolean;
  has_issues: boolean;
  private: boolean;
}

export interface Repo {
  owner: string;
  name: string;
  description?: string;
  allowAutoMerge?: boolean;
  allowMergeCommit?: boolean;
  allowRebaseMerge?: boolean;
  allowSquashMerge?: boolean;
  allowUpdateBranch?: boolean;
  deleteBranchOnMerge?: boolean;
  hasIssues: boolean;
  isPrivate: boolean;
}

export interface CreateRepoOptions extends Partial<Repo> {
  owner: string;
  name: string;
  isPrivate: boolean;
  useSquashPrTitleAsDefault?: boolean;
}

export interface UpdateRepoOptions extends Partial<CreateRepoOptions> {
  owner: string;
  name: string;
}

interface GitHubBranchProtection {
  required_status_checks?: {
    url?: string;
    contexts: string[];
    contexts_url?: string;
    enforcement_level?: string;
    strict?: boolean;
  };
  enforce_admins?: {
    url: string;
    enabled: boolean;
  };
  required_pull_request_reviews?: {
    url?: string;
    dismissal_restrictions?: {
      url?: string;
      users_url?: string;
      teams_url?: string;
      users?: any[];
      teams?: any[];
      apps?: any[];
    };
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count?: number;
  };
  restrictions?: {
    url: string;
    users_url: string;
    teams_url: string;
    apps_url: string;
    users: any[];
    teams: any[];
    apps: any[];
  };
  required_linear_history?: {
    enabled?: boolean;
  };
  allow_force_pushes?: {
    enabled?: boolean;
  };
  allow_deletions?: {
    enabled?: boolean;
  };
  required_conversation_resolution?: {
    enabled?: boolean;
  };
}

export interface BranchProtection {
  requiredStatusChecks: string[];
  requiredStatusChecksStrict?: boolean;
  requiredApprovingReviewCount?: number;
  requiredLinearHistory: boolean;
  allowForcePushes: boolean;
  allowDeletions: boolean;
  requiredConversationResolution: boolean;
  enforceAdmins: boolean;
}

export interface BranchProtectionOptions extends BranchOptions {
  requiredStatusChecks?: string[];
  requiredStatusChecksStrict?: boolean;
  requiredApprovingReviewCount?: number;
  requiredLinearHistory?: boolean;
  allowForcePushes?: boolean;
  allowDeletions?: boolean;
  requiredConversationResolution?: boolean;
  enforceAdmins?: boolean;
}

interface BranchOptions {
  repoOwner: string;
  repoName: string;
  branch: string;
}

interface LabelOptions {
  repoOwner: string;
  repoName: string;
  name: string;
  description: string;
  color: string;
}

export class GitHubApiAdapter {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
  }

  public async createOrUpdateRepo(options: CreateRepoOptions): Promise<Repo> {
    const { owner, name } = options;

    const alreadyExists = await this.repoExists(owner, name);

    if (alreadyExists) {
      return this.updateRepo(options);
    }

    return this.createRepo(options);
  }

  public async createOrUpdateLabel(options: LabelOptions) {
    const { repoOwner, repoName, name } = options;

    const labelExists = await this.labelExists(repoOwner, repoName, name);

    if (labelExists) {
      return this.updateLabel(options);
    }

    return this.createLabel(options);
  }

  public async deleteLabel(repoOwner: string, repoName: string, name: string) {
    const labelExists = await this.labelExists(repoOwner, repoName, name);

    if (!labelExists) {
      return;
    }

    return this.octokit.rest.issues.deleteLabel({
      owner: repoOwner,
      repo: repoName,
      name,
    });
  }

  public async getBranchProtection(
    repoOwner: string,
    repoName: string,
    branch: string,
  ) {
    const response = await this.octokit.rest.repos.getBranchProtection({
      owner: repoOwner,
      repo: repoName,
      branch,
    });

    return this.gitHubBranchProtectionToBranchProtection(response.data);
  }

  public async updateBranchProtection(options: BranchProtectionOptions) {
    const {
      requiredStatusChecks,
      requiredStatusChecksStrict,
      requiredApprovingReviewCount,
      repoOwner,
      repoName,
      branch,
      enforceAdmins,
      requiredConversationResolution,
      allowDeletions,
      allowForcePushes,
      requiredLinearHistory,
    } = options;

    const enableRequiredStatusChecks =
      requiredStatusChecks && requiredStatusChecks.length > 0;

    const required_status_checks = enableRequiredStatusChecks
      ? {
          strict: requiredStatusChecksStrict || false,
          contexts: requiredStatusChecks,
        }
      : // eslint-disable-next-line unicorn/no-null
        null;

    const required_pull_request_reviews = {
      required_approving_review_count: requiredApprovingReviewCount,
    };

    return this.octokit.rest.repos.updateBranchProtection({
      owner: repoOwner,
      repo: repoName,
      branch,
      required_status_checks,
      // eslint-disable-next-line unicorn/no-null
      enforce_admins: enforceAdmins || null,
      required_pull_request_reviews,
      required_linear_history: requiredLinearHistory,
      allow_force_pushes: allowForcePushes,
      allow_deletions: allowDeletions,
      required_conversation_resolution: requiredConversationResolution,
      // eslint-disable-next-line unicorn/no-null
      restrictions: null,
    });
  }

  public async deleteBranchProtection(
    owner: string,
    repo: string,
    branch: string,
  ) {
    const response = await this.octokit.rest.repos.deleteBranchProtection({
      owner,
      repo,
      branch,
    });

    return response.status === 204;
  }

  public async createCommitSignatureProtection(
    repoOwner: string,
    repoName: string,
    branch: string,
  ) {
    return this.octokit.rest.repos.createCommitSignatureProtection({
      owner: repoOwner,
      repo: repoName,
      branch: branch,
    });
  }

  public async enableVulnerabilityAlerts(repoOwner: string, repoName: string) {
    return this.octokit.rest.repos.enableVulnerabilityAlerts({
      owner: repoOwner,
      repo: repoName,
    });
  }

  public async repoExists(owner: string, name: string): Promise<boolean> {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo: name,
      });

      return response.status === 200;
    } catch (error: any) {
      const status = (error as GitHubResponse).status;
      if (status === 404) {
        return false;
      }

      throw error;
    }
  }

  public async getRepo(owner: string, name: string): Promise<Repo> {
    const response = await this.octokit.rest.repos.get({
      owner,
      repo: name,
    });

    return this.gitHubRepoToRepo(response.data);
  }

  public async updateRepo(options: UpdateRepoOptions): Promise<Repo> {
    const gitHubRepoOptions = this.repoOptionsToGitHubRepoOptions(options);
    const response = await this.octokit.rest.repos.update(gitHubRepoOptions);

    return this.gitHubRepoToRepo(response.data);
  }

  public async deleteRepo(owner: string, name: string): Promise<boolean> {
    const response = await this.octokit.rest.repos.delete({
      owner,
      repo: name,
    });

    return response.status === 204;
  }

  private async createRepo(options: CreateRepoOptions): Promise<Repo> {
    const gitHubRepoOptions = this.repoOptionsToGitHubRepoOptions(options);
    const response = await this.octokit.rest.repos.createForAuthenticatedUser(
      gitHubRepoOptions,
    );

    return this.gitHubRepoToRepo(response.data);
  }

  private repoOptionsToGitHubRepoOptions(options: UpdateRepoOptions) {
    return {
      owner: options.owner,
      repo: options.name,
      name: options.name,
      description: options.description,
      allow_auto_merge: options.allowAutoMerge,
      allow_merge_commit: options.allowMergeCommit,
      allow_rebase_merge: options.allowRebaseMerge,
      allow_squash_merge: options.allowSquashMerge,
      allow_update_branch: options.allowUpdateBranch,
      delete_branch_on_merge: options.deleteBranchOnMerge,
      has_issues: options.hasIssues,
      private: options.isPrivate,
      use_squash_pr_title_as_default: options.useSquashPrTitleAsDefault,
    };
  }

  private gitHubRepoToRepo(gitHubRepo: GitHubRepo): Repo {
    return {
      owner: gitHubRepo.owner.login,
      name: gitHubRepo.name,
      description: gitHubRepo.description ?? undefined,
      allowAutoMerge: gitHubRepo.allow_auto_merge,
      allowMergeCommit: gitHubRepo.allow_merge_commit,
      allowRebaseMerge: gitHubRepo.allow_rebase_merge,
      allowSquashMerge: gitHubRepo.allow_squash_merge,
      allowUpdateBranch: gitHubRepo.allow_update_branch,
      deleteBranchOnMerge: gitHubRepo.delete_branch_on_merge,
      hasIssues: gitHubRepo.has_issues,
      isPrivate: gitHubRepo.private,
    };
  }

  private gitHubBranchProtectionToBranchProtection(
    gitHubBranchProtection: GitHubBranchProtection,
  ): BranchProtection {
    return {
      requiredStatusChecks:
        gitHubBranchProtection.required_status_checks?.contexts ?? [],
      requiredStatusChecksStrict:
        gitHubBranchProtection.required_status_checks?.strict,
      requiredLinearHistory:
        gitHubBranchProtection.required_linear_history?.enabled ?? false,
      requiredApprovingReviewCount:
        gitHubBranchProtection.required_pull_request_reviews
          ?.required_approving_review_count,
      allowForcePushes:
        gitHubBranchProtection.allow_force_pushes?.enabled ?? false,
      allowDeletions: gitHubBranchProtection.allow_deletions?.enabled ?? false,
      requiredConversationResolution:
        gitHubBranchProtection.required_conversation_resolution?.enabled ??
        false,
      enforceAdmins: gitHubBranchProtection.enforce_admins?.enabled ?? false,
    };
  }

  private async labelExists(
    repoOwner: string,
    repoName: string,
    name: string,
  ): Promise<boolean> {
    const response = await this.octokit.rest.issues.listLabelsForRepo({
      owner: repoOwner,
      repo: repoName,
    });

    const existingLabels = response.data;
    const existingLabelNames = new Set(
      existingLabels.map((label) => label.name),
    );

    return existingLabelNames.has(name);
  }

  private async updateLabel(options: LabelOptions) {
    return this.octokit.rest.issues.updateLabel({
      ...options,
      owner: options.repoOwner,
      repo: options.repoName,
    });
  }

  private async createLabel(options: LabelOptions) {
    return this.octokit.rest.issues.createLabel({
      ...options,
      owner: options.repoOwner,
      repo: options.repoName,
    });
  }
}
