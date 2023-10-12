import { ProjectConfiguration, TargetConfiguration } from "@nx/devkit";

export class ProjectJsonUtils {
  public static upsertTarget<T = any>(
    projectJson: ProjectConfiguration,
    targetName: string,
    config: TargetConfiguration<T>,
  ) {
    const targets = this.getTargets(projectJson);

    // eslint-disable-next-line security/detect-object-injection
    targets[targetName] = config;
  }

  public static addTargetDependency(
    projectJson: ProjectConfiguration,
    targetName: string,
    dependency: string,
  ) {
    const targets = this.getTargets(projectJson);

    if (!targets) {
      throw new Error(
        `Unexpectedly did not find a targets key in:\n${JSON.stringify(
          projectJson,
          undefined,
          2,
        )}`,
      );
    }

    // eslint-disable-next-line security/detect-object-injection
    const target = targets[targetName];

    if (!target) {
      throw new Error(
        `Unexpectedly did not find ${targetName} in:\n${JSON.stringify(
          targets,
          undefined,
          2,
        )}`,
      );
    }

    if (!target.dependsOn) {
      target.dependsOn = [];
    }

    target.dependsOn.push(dependency);
  }

  private static getTargets(projectJson: ProjectConfiguration) {
    const targets = projectJson.targets;

    if (!targets) {
      throw new Error(
        `Unexpectedly did not find a targets key in:\n${JSON.stringify(
          projectJson,
          undefined,
          2,
        )}`,
      );
    }

    return targets;
  }
}
