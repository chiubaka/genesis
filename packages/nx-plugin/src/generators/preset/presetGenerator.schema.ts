import { GitGeneratorSchema } from "../git";

export interface PresetGeneratorSchema extends GitGeneratorSchema {
  name: string;
  skipInstall?: boolean;
  tags?: string;
  directory?: string;
}
