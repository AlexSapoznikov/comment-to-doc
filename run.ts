/**
 * Test run
 */

import { Config } from "./src/types";
import { defaultTags } from "./src/defaultConfig";
import generateDocs from "./src";

const runConfig: Config = {
  files: [
    './tests/test-files/run.tsx',
  ],
  tags: defaultTags,
  output: () => './src/run.md'
};

generateDocs(runConfig);
