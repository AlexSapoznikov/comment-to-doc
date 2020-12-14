/**
 * Full flow test: read file + generate docsJSON + write documentation
 *
 * Following comment structure should be parsed:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import generateDocs, { defaultTags, Config } from "../src";
import * as fs from 'fs';

const output = './tests/test-files/order-alias-test.md';

const config: Config = {
  files: [
    './tests/test-files/read-testfile.ts',
    './tests/test-files/read-testfile-2.ts',
  ],
  tags: defaultTags,
  output: () => output,
  tagsOrder: ['Tag4', 'Tag:fromOtherFile', 'Tag2', 'Tag:alias2', 'Tag3', 'Tag:alias']
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
      expect(doc.data[0].tag).toEqual('Tag4');

      expect(doc.data[1].tag).toEqual('Tag');
      expect(doc.data[1].alias).toEqual('fromOtherFile');

      expect(doc.data[2].tag).toEqual('Tag2');

      expect(doc.data[3].tag).toEqual('Tag');
      expect(doc.data[3].alias).toEqual('alias2');

      expect(doc.data[4].tag).toEqual('Tag3');

      expect(doc.data[5].tag).toEqual('Tag');
      expect(doc.data[5].alias).toEqual('alias');
    })
  });
});

afterAll(() => {
  it ('Documentation file should appear', async () => {
    expect(fs.existsSync(output))
      .toEqual(true);
  });
}, 5000);
