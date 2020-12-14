/**
 * Config for CLI
 */

const { defaultTags } = require('./lib')

module.exports = {
  files: [
    './tests-input.tsx',
    './tests-input-concat.tsx',
  ],
  tags: defaultTags,
  output: () => './cli-output.md'
};
