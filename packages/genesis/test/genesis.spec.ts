const mockSpawn = jest.fn();

jest.mock("node:child_process");
jest.mock("node:util", () => {
  return {
    promisify: () => {
      return mockSpawn;
    },
  };
});

import { genesis } from "../bin/genesis";

jest.setTimeout(20_000);

describe("genesis", () => {
  it("passes the correct variables down to `create-nx-workspace`", async () => {
    await genesis([
      "node",
      "genesis",
      "-s",
      "chiubaka",
      "-n",
      "preset",
      "-r",
      "http://localhost:4873",
    ]);

    expect(mockSpawn).toHaveBeenCalledTimes(1);
    expect(mockSpawn).toHaveBeenCalledWith(
      "npx",
      [
        "create-nx-workspace",
        "chiubaka",
        "--preset=@chiubaka/nx-plugin",
        "--nxCloud=false",
        "--directory=preset",
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          npm_config_registry: "http://localhost:4873",
        },
      },
    );
  });
});