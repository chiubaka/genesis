export interface CircleCiConfig {
  orbs?: Record<string, string>;
  workflows: Record<string, Workflow>;
}

interface Workflow {
  jobs: any[];
}
