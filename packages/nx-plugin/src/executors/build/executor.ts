import { BuildExecutorSchema } from "./schema";

export default function runExecutor(options: BuildExecutorSchema) {
  // eslint-disable-next-line no-console
  console.log("Executor ran for Build.", options);
  return Promise.resolve({
    success: true,
  });
}
