interface GenerateOptions {
  /**
   * Length of the generated password.
   * @default 10
   */
  length?: number;
  /**
   * Should the password include numbers
   * @default false
   */
  numbers?: boolean;
  /**
   * Should the password include symbols, or symbols to include
   * @default false
   */
  symbols?: boolean | string;
  /**
   * Should the password include lowercase characters
   * @default true
   */
  lowercase?: boolean;
  /**
   * Should the password include uppercase characters
   * @default true
   */
  uppercase?: boolean;
  /**
   * Should exclude visually similar characters like 'i' and 'I'
   * @default false
   */
  excludeSimilarCharacters?: boolean;
  /**
   * List of characters to be excluded from the password
   * @default ""
   */
  exclude?: string;
  /**
   * Password should include at least one character from each pool
   * @default false
   */
  strict?: boolean;
}

export interface PasswordGenerator {
  generate: (options?: GenerateOptions) => string;
  generateMultiple: (count: number, options?: GenerateOptions) => string[];
}
