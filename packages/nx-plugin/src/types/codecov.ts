export interface CodecovConfig {
  flag_management?: {
    default_rules?: {
      carryforward?: boolean;
      statuses?: CodecovTargetStatus[];
    };
  };
}

export interface CodecovTargetStatus {
  type: "project" | "patch";
  target: string;
  threshold: string;
}
