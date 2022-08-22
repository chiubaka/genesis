import { names } from "@nrwl/devkit";

export interface ProjectNames {
  camelCase: string;
  kebabCase: string;
  pascalCase: string;
}

export const projectNameCasings = (projectName: string): ProjectNames => {
  const {
    className: pascalCase,
    fileName: kebabCase,
    propertyName: camelCase,
  } = names(projectName);

  return {
    camelCase,
    kebabCase,
    pascalCase,
  };
};
