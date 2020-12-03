/**
 * Config for CLI
 */

const { defaultTags } = require('./lib')

module.exports = {
  files: [
    './tests-input.tsx',
  ],
  tags: defaultTags,
  output: () => './a/cli-output.md'
};
