export type Config = {
  files: string | string[],
  excludeFiles?: string | string[],
  tags?: Tag[],
  output?: (dir: string, fileName: string) => string,
  outputExt?: string,
  template?: Template,

  /**
   * Will only generate document with tags that are defined in "tags" array.
   * Default: false, so it uses all tags.
   */
  strict?: boolean,
};

export type Tag = {
  tag: string,
  render?: TagRender,
  children?: Tag[]
};

export type Template = {
  /**
   * Depending on value, validation will fail if:
   *   - Any tag that does not exist in "template.rules" array is found
   *   - Order of the tags is different from one specified in "template.rules" array
   */
  strictness?: TemplateStrictness,

  /**
   * Rules
   */
  rules?: Rule[]

  /**
   * Defines the type of error handling.
   * Default: 'error'
   */
  errorHandling?: ErrorHandling,
};

export type TagRender = (commentData: ParsedComment) => string;

export type Rule = {
  tag: string,
  mandatory?: boolean,
};

export enum TemplateStrictness {
  Strict = 'STRICT',
  IgnoreOrder = 'IGNORE_ORDER',
}

export enum ErrorHandling {
  Error = 'ERROR',
  Warn = 'WARN'
}

export type GlobOpts = Record<any, any>;

export type FileContent = {
  path: string,
  content: string,
};

export type ExtractedTagData = {
  tag: string,
  alias: string,
  type: string,
  required: boolean,
  description: string,
  extras: string[],
};

export type ParsedComment = ExtractedTagData & {
  content: string,
  children?: ParsedComment[]
};

export type DocJSON = {
  path: string,
  data: ParsedComment[],
  output?: string;
};

export type DocsJSON = DocJSON[];
