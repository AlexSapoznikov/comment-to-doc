/**
 * Manual test run
 */

import generateDocs, { Config, defaultTags } from "./src";

const runConfig: Config = {
  files: [
    'run.tsx',
  ],
  tags: defaultTags,
  output: () => './run.md'
};

generateDocs(runConfig);
