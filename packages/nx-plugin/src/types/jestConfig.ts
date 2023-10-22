export interface JestConfig {
  coverageDirectory?: string;
  reporters?: JestReporter[];
  setupFilesAfterEnv?: string[];
}

type JestReporter = [string, Record<string, string>];
