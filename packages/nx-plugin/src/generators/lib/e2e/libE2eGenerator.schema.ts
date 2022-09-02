export interface LibE2eGeneratorSchema extends LibE2eGeneratorBaseSchema {
  codeSamplePath: string;
}

export interface LibE2eGeneratorBaseSchema {
  name: string;
  libName: string;
}
