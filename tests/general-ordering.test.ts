/**
 * Full flow test: read file + generate docsJSON + write documentation
 *
 * Following comment structure should be parsed:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import generateDocs, { defaultTags, Config } from "../src";
import * as fs from 'fs';

const output = './tests/test-files/general-order-test.md';

const config: Config = {
  files: [
    './tests/test-files/read-testfile.ts',
  ],
  tags: defaultTags,
  output: () => output,
  tagsOrder: ['Tag5', 'Tag3', 'Tag2']
};

beforeAll(() => {
  if (fs.existsSync(output)) {
    fs.unlinkSync(output);
  }
});

describe('Ordering test', () => {
  it ('Documentation file should be created and tags re-ordered', async () => {
    const result = await generateDocs(config);
    expect(result).toBeDefined()

    result.forEach(doc => {
      expect(doc.data[0].tag).toEqual('Tag5');
      expect(doc.data[1].tag).toEqual('Tag5');
      expect(doc.data[2].tag).toEqual('Tag3');
      expect(doc.data[3].tag).toEqual('Tag2');
    })
  });
});

afterAll(() => {
  it ('Documentation file should appear', async () => {
    expect(fs.existsSync(output))
      .toEqual(true);
  });
}, 5000);
