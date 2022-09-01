import { exec } from "../exec";

export async function lintFix(cwd: string, projectName?: string) {
  await (!projectName
    ? exec("nx run-many --target=lint --all --fix", { cwd })
    : exec(`nx lint ${projectName} --fix`, { cwd }));
}
