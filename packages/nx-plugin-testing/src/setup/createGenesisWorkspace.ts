import { tmpProjPath } from "@nrwl/nx-plugin/testing";
import path from "node:path";

import { TestingWorkspace } from "../testingWorkspace";

export const createGenesisWorkspace = (workspaceName = "genesis-e2e") => {
  const destination = path.join(tmpProjPath(), "..", workspaceName);

  return new TestingWorkspace(destination);
};
