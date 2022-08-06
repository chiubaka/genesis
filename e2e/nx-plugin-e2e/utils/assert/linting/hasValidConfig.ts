import { runCommandAsync } from "@nrwl/nx-plugin/testing";

export const hasValidConfig = () => {
  expect(async () => {
    await runCommandAsync("yarn run eslint --print-config package.json");
  }).not.toThrow();
};
