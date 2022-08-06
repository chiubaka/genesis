import { runCommandAsync, tmpProjPath, uniq } from "@nrwl/nx-plugin/testing";
import fs from "node:fs";

export const canFixIssues = async () => {
  const lintErrorsFileName = `${uniq("fixableLintErrors")}.ts`;
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(
    tmpProjPath(lintErrorsFileName),
    "export const hello = 'Hello, world!'",
  );

  await expect(async () => {
    await runCommandAsync("yarn run eslint .");
  }).rejects.toThrow();

  await runCommandAsync("yarn run eslint --fix .");

  expect(async () => {
    await runCommandAsync("yarn run eslint .");
  }).not.toThrow();

  fs.rmSync(tmpProjPath(lintErrorsFileName));
};
