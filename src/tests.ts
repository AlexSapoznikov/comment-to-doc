/**
 * Manual test run
 */

import generateDocs, { Config, defaultTags } from ".";

const config: Config = {
  files: [
    'tests-input.tsx',
  ],
  tags: defaultTags,
  output: () => './tests-output.md'
};

generateDocs(config);
