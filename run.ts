/**
 * Manual test run
 */

import { Config } from "./src/types";
import { defaultTags } from "./src/defaultConfig";
import generateDocs from "./src";

const runConfig: Config = {
  files: [
    'run.tsx',
  ],
  tags: defaultTags,
  output: () => './run.md'
};

generateDocs(runConfig);
