import {
  addDependenciesToPackageJson,
  getPackageManagerCommand,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { PackageJson } from "nx/src/utils/package-json";

import { exec } from "../../utils";
import { GitHooksGeneratorSchema } from "./gitHooksGenerator.schema";

enum GitHook {
  ApplyPatchMessage = "applypatch-msg",
  CommitMessage = "commit-msg",
  PostUpdate = "post-update",
  PreApplyPatch = "pre-applypatch",
  PreCommit = "pre-commit",
  PrePush = "pre-push",
  PreRebase = "pre-rebase",
  PrepareCommitMessage = "prepare-commit-msg",
  Update = "update",
}

export function gitHooksGenerator(
  tree: Tree,
  options: GitHooksGeneratorSchema,
) {
  const huskyInstallTask = installHusky(tree);
  const createPreCommitHookTask = createPreCommitHook(
    tree,
    options.preCommitCommand,
  );
  const createPrePushHookTask = createPrePushHook(tree, options.prePushCommand);

  return async () => {
    await huskyInstallTask();
    await createPreCommitHookTask();
    await createPrePushHookTask();
  };
}

function installHusky(tree: Tree) {
  const installTask = addDependenciesToPackageJson(
    tree,
    {},
    {
      husky: "latest",
    },
  );

  updateJson<PackageJson>(tree, "package.json", (json) => {
    if (!json.scripts) {
      json.scripts = {};
    }

    json.scripts.prepare = "husky install";

    return json;
  });

  return async () => {
    await installTask();

    const pmc = getPackageManagerCommand();
    const command = pmc.run("prepare", "");
    await exec(command, {
      cwd: tree.root,
    });
  };
}

function createPreCommitHook(tree: Tree, preCommitCommand?: string) {
  return createGitHook(tree, GitHook.PreCommit, preCommitCommand);
}

function createPrePushHook(tree: Tree, prePushCommand?: string) {
  return createGitHook(tree, GitHook.PrePush, prePushCommand);
}

function createGitHook(tree: Tree, hook: GitHook, hookCommand?: string) {
  if (!hookCommand) {
    return () => {
      return Promise.resolve();
    };
  }

  const pmc = getPackageManagerCommand();
  const command = `${pmc.exec} husky add .husky/${hook} "${hookCommand}"`;

  return async () => {
    await exec(command, {
      cwd: tree.root,
    });
  };
}
