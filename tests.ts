/**
 * Manual test run
 */

import generateDocs, { Config, defaultTags } from "./src";

const runConfig: Config = {
  files: [
    'test-input.tsx',
  ],
  tags: defaultTags,
  output: () => './test-output.md'
};

generateDocs(runConfig);
