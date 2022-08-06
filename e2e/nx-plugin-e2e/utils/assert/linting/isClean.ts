import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const isClean = () => {
  expect(async () => {
    await runCommandAsync("yarn run eslint .");
  }).not.toThrow();
};
