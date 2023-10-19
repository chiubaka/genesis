export interface CircleCiConfig {
  setup?: boolean;
  orbs?: Record<string, string>;
  workflows: Record<string, Workflow>;
}

interface Workflow {
  jobs: any[];
}
