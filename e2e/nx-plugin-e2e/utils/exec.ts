import { exec as originalExec } from "node:child_process";
import { promisify } from "node:util";

export const exec = promisify(originalExec);
