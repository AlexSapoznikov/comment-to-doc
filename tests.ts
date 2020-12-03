/**
 * Manual test run
 */

import generateDocs, { Config, defaultTags } from "./src";

const runConfig: Config = {
  files: [
    'tests-input.tsx',
  ],
  tags: defaultTags,
  output: () => './tests-output.md'
};

generateDocs(runConfig);
