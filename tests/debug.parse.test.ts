/**
 * This test file exists for debug purposes
 * npm run test -- 'debug'
 */

import { testParser } from "./utils/parser";

const testCases = [
  {
    in: `
      /**
       * @Tag:alias
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "",
      "extras": [],
      "description": "",
      "content": ""
    }
  },
]

describe('Debug', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = testParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
