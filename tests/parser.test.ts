/**
 * Parser tests
 *
 * Following comment structure should be parsed even when some parts missing:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import { Config } from "../src/types";
import { readFiles } from "../src/readFiles";
import { getDocsJSON } from "../src/getDocsJSON";
import findChildTags from "../src/getChildren";
import { defaultTags } from "../src/defaultConfig";

const parserTestConfig: Config = {
  files: [
    './tests/test-files/structure.ts',
  ],
  tags: defaultTags,
}

const parser = async (config: Config) => {
  const tags = config?.tags || [];
  const filePaths = config?.files && Array.isArray(config.files) ? config.files : [config.files];
  const excludeFilePaths = config?.excludeFiles && Array.isArray(config.excludeFiles) ? config.excludeFiles : [config.excludeFiles];

  // Get file contents
  const fileContents = await readFiles(filePaths as string[], {
    ignore: excludeFilePaths as string[]
  });

  // Parse contents
  let docsJSON = getDocsJSON(fileContents);

  // Find children tags
  docsJSON = findChildTags(docsJSON, tags);

  return docsJSON;
};

describe('Parser tests', () => {
  it ('asd', async () => {
    const docsJSON = await parser(parserTestConfig);

    console.log('docsJSON', docsJSON)

    test('test', () => {
      expect(true).toBe(true);
    });
  })
});
