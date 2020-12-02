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
import { defaultTags } from "./src/defaultConfig";
import generateDocs, { defaultTags, Config } from "comment-to-doc";

const config: Config = {
  files: [
    './src/**/*.tsx',
  ],
  tags: defaultTags
};

generateDocs(runConfig);
```
