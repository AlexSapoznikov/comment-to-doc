/**
 * Full flow test: read file + generate docsJSON + write documentation
 *
 * Following comment structure should be parsed:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import generateDocs, { defaultTags, Config } from "../src";
import * as fs from 'fs';

const output = './tests/test-files/read-testfile.md';

const runConfig: Config = {
  files: [
    './tests/test-files/read-testfile.ts',
  ],
  tags: defaultTags,
  output: () => output,
};

beforeAll(() => {
  if(fs.existsSync(output)) {
    fs.unlinkSync(output);
  }
});

describe('Full flow test', () => {
  it ('Documentation file should be created', async () => {
    const result = await generateDocs(runConfig);
    expect(result).toBeDefined()
  });
});

afterAll(() => {
  it ('Documentation file should appear', async () => {
    expect(fs.existsSync(output))
      .toEqual(true);
  });
}, 5000);
