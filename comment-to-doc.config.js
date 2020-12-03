/**
 * Config for CLI
 */

// import generateDocs, { defaultTags } from "./src";
const { defaultTags } = require('./lib')

module.exports = {
  files: [
    './tests-input.tsx',
  ],
  tags: defaultTags,
  output: () => './cli-output.md'
};
