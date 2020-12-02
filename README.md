# Comment-to-doc
Module for parsing specific type of comments and generating documentation from them.
Comments are similar to ones used in [jsdoc](https://jsdoc.app/).
This module parses comments and lets you define how you render them into a document and type of document.
By default the output is a *.md* file (can be anything) and some default comment types are defined.

## Why
Because I needed to generate some documentation from my code,
but outputs of other modules were not what I needed.
Some of them created HTML documentation webpages, others generated undesired markup.
I wanted specifically to create `.md` files for each file that I had documented.
This module is though able to generate files with any extension and output defined by user.  

## Install
```
npm install --save-dev comment-to-doc
```

## Usage
The fastest way to get started with default configuration is like this:
```
import generateDocs, { Config, defaultTags } from "comment-to-doc";

const runConfig: Config = {
  files: [
    './src/**/*.tsx',
  ],
  tags: defaultTags,
};

generateDocs(runConfig);
```

### Configuration

#### *config*
```
{
  files: string | string[],
  excludeFiles?: string | string[],
  tags?: Tag[],
  outputExt?: string,
  output?: (dir: string, fileName: string) => string,
  template?: Template,
  strict?: boolean,
}
```

key           | Mandatory   | type                                        | default                                                        | description
------------- | ----------- | ------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------
files         | *Mandatory* | `string` or `string[]`                      | `undefined`                                                    | paths to files to read comments from (uses [glob](https://www.npmjs.com/package/glob)).
excludeFiles  | *Optional*  | `string` or `string[]`                      | `undefined`                                                    | paths to files which should be excluded from `files` paths (uses [glob](https://www.npmjs.com/package/glob)).  
tags          | *Optional*  | `Tag[]`                                     | `[]`                                                           | Tags configuration which define how each comment tag is rendered into documentation block.
outputExt     | *Optional*  | `string`                                    | `md`                                                           | Extension of output documentation file.
output        | *Optional*  | `(dir: string, fileName: string) => string` | `${dir}/${fileName}.${outputExt}`                              | Output path for documentation. Read file directory and name can be used to generate one.
template      | *Optional*  | `Template`                                  | `{ rules: {}, strictness: undefined, errorHandling: 'error' }` | Configuration for enforcing specific tags and their order.                              
strict        | *Optional*  | `boolean`                                   | `false`                                                        | If true, will only generate document with tags that are defined in "tags" array. By default all tags are used.

#### *config.template*

- strictness `TemplateStrictness.Strict | TemplateStrictness.IgnoreOrder`
    - `TemplateStrictness.Strict` - Fail validation if any mandatory tag that does not exist in "template.rules" array is found or order of mandatory tags is not correct.
    - `TemplateStrictness.IgnoreOrder` - Fail validation if any mandatory tag that does not exist in "template.rules" array is found. Order is not important.
    
- rules `{ tag: string, mandatory?: boolean }`
    - tag - the tag name which is also specified in **tags** array.
    - mandatory - set true if validation must apply to it.
     
- errorHandling `ErrorHandling.Error | ErrorHandling.Warn`
    - `ErrorHandling.Error` - Validation fails with an error and stops the process.
    - `ErrorHandling.Warn` - Validation fails with warnings and does not stop the process.

## Parser
## Comment synta
## Default tags
## Building tags
