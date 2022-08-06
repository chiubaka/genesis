import { checkFilesExist } from "@nrwl/nx-plugin/testing";

export const exists = (path: string) => {
  expect(() => {
    checkFilesExist(path);
  }).not.toThrow();
};
