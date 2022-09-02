import { ProjectType } from "../../utils";

export interface ProjectGeneratorBaseSchema {
  projectName: string;
  projectType: ProjectType;
  rootProjectGeneratorName: string;
}
