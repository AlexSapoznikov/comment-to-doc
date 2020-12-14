/**
 * Manual test run
 */

import generateDocs, { Config, defaultTags } from ".";

const config: Config = {
  files: [
    'tests-input.tsx',
    'tests-input-concat.tsx',
  ],
  tags: defaultTags,
  output: () => './tests-output.md',

  // Ordering tests - enable following comments to test with "try" script if needed
  // tagsOrder: ['Usage', 'Title2', 'Italic', 'Bold'],
  // tagsOrderInFiles: {
  //   'tests-input.tsx': ['Bold', 'Italic', 'Title2', "Usage"]
  // }
};

generateDocs(config);
