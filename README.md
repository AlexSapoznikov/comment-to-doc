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
tags          | *Optional*  | `Tag[]`                                     | `[]`                                                           | Tags configuration which define how each comment tag is rendered into documentation block. By default, if no tags are passed, only the tag with its content will be written to documentation file.
outputExt     | *Optional*  | `string`                                    | `md`                                                           | Extension of output documentation file.
output        | *Optional*  | `(dir: string, fileName: string) => string` | `${dir}/${fileName}.${outputExt}`                              | Output path for documentation. Read file directory and name can be used to generate one.
template      | *Optional*  | `Template`                                  | `{ rules: {}, strictness: undefined, errorHandling: 'error' }` | Configuration for enforcing specific tags and their order.                              
strict        | *Optional*  | `boolean`                                   | `false`                                                        | If true, will only generate document with tags that are defined in "tags" array. By default all tags are used.

#### *config.tags*
A simple tag is defined like this:
```
type Tag = {
  tag: string,
  render?: (parsedComment: ParsedComment) => string,
  children?: Tag[]
}
```
For more details, [click here](#generate-doc) to see how to configure tag in order to generate documentation.

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

## Comment syntax

Following example is the full syntax of the comment.
```
/**
 * @MyTagName:alias {type} [my,extra,data] my description
 * my content
 */
```
**However**, the only mandatory part of it is `@MyTagName`, so it can be as simple as this:
```
/**
 * @MyTag
 */
```

Multiple tags can alsoe exist in the same comment:
```
/**
 * @Tag
 */

/**
 * @MyTag
 * @MyOtherTag
 * @YetAnotherOne
 */
```

Valid comment styles are:
```
/**
 * @Tag:alias {type} [my,extra,data] my description
 * Content
 */
```
```
/** @Tag:alias {type} [my,extra,data] my description
Content
*/
```
```
/*
 * @Tag:alias {type} [my,extra,data] my description
 * Content
 */
```
```
/** @Tag:alias {type} [my,extra,data] my description */
```
```
/* @Tag:alias {type} [ my , extra, data] my description */
```

*Note: Some of them do not support `content`*

*Note: Yes you can use spaces inside `{ type }` and `[ my , extra, data]`*

## Parser
Following text
```
...

My code or whatever else stuff

/**
 * @MyTagName:alias {type} [my,extra,data] my description
 * my content
 */

My code or whatever else stuff

/**
 * @EmptyTag
 */

My code or whatever else stuff

...

```

will be parsed into **docsJSON** which is following:
```
[
  {
    "tag": "MyTagName",
    "alias": "alias",
    "type": "type",
    "extras": [
      "my",
      "extra",
      "data"
    ],
    "description": "my description",
    "content": "my content"
  },
  {
    "tag": "EmptyTag",
    "alias": "",
    "type": "",
    "extras": [],
    "description": "",
    "content": ""
  }
]
```
- **tag** - the name of the tag
- **alias** - is used to connect parent with children, but can be used for whatever other reasons as well if children functionality not used.
- **type** - usually used to define a type (for example object type), but can be used for whatever other reasons.
- **extras** - possibility to pass extra data in order to help render doc from the tag
- **description** - one-line description text
- **content** - multi-line description text

If you need to use the parser for your own purposes, you can import and use it like this:
```
import { commentParser } from "comment-to-doc";

commentParser(text, tags);
```

## <a name="generate-doc">Generating document</a>
The tag type is following:
```
type Tag = {
  tag: string,
  render?: (parsedComment: ParsedComment) => string,
  children?: Tag[]
}
```


1. Suppose we have a file called `file.ts` on root level with following comment:

    ```
    /**
     * @MyTagName {Singer} [Eminem, Marshall Mathers] He makes good music
     * Eminem said once:
     * > The truth is you don't know what is going to happen tomorrow. Life is a crazy ride, and nothing is guaranteed. I am whatever you say I am; if I wasn't, then why would you say I am.
     */
    ```

1. To define a single tag, give it a name and define how to render it into documentation block.
    
   ```
   const tag = {
     tag: 'MyTagName',
     render: ({tag, type, extras, description, content}) => {
       return [
         `## ${extras[0]}`,
         `- Name: ${extras[1]}`,
         `- He is ${type}`,
         `- ${description}`,
         '',
         content,
         '',
         `- created by ${tag}`
       ].join('\n');
     }
   }
   ```

1. Specify configuration

   ```
   const config = {
     files: [
       'file.ts',
     ],
     tags: [tag]  
   };
   ```
   
1. Run generator
  
    ```
   generateDocs(config);
   ```

----------
   
**This will be the output**:

## Eminem
- Name: Marshall Mathers
- He is Singer
- He makes good music

Eminem said once:
> The truth is you don't know what is going to happen tomorrow. Life is a crazy ride, and nothing is guaranteed.

- created by MyTagName
------------

## CLI
```
Usage: comment-to-doc [options]

Options:
  -c, --config <path>  Path to configuration file.
  -i, --info           Include more info about generation results.
  -h, --help           display help for command
```
By default the module with search for configuration in `./comment-to-doc.config.js`,


## Default tags

- @Title
- @Title2
- @Title3
- @Title4
- @Title5
- @Title6
- @Usage
- @Description
- @Default
- @Bold
- @Italic
- @Crossover
- @Img
- @Image
- @Quote
- @Code
- @Custom
- @Date
- @Table
- @Column
- @Object
- @Key

For usage, see:
- Input: <a href="https://github.com/AlexSapoznikov/comment-to-doc/blob/master/tests-input.tsx">`tests-input.tsx`</a>
- Output: <a href="https://github.com/AlexSapoznikov/comment-to-doc/blob/master/tests-output.md">`tests-output.md`</a>

## Want to play around a bit?
1. Clone or fork this repository.
1. `npm install`
1. Edit `tests-input.tsx` file
1. `npm run try`
1. See `tests-output.md` for results

## Tests
`npm test` to run tests

## Your own tags
If you come up with your own cool tags, you can send me a link to your repository,
so I could add it here in this documentation.
