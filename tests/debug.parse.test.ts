/**
 * This test file exists for debug purposes
 * npm run test -- 'debug'
 */

import { commentParser } from "../src";

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
      "required": false,
      "extras": [],
      "description": "",
      "content": ""
    }
  },
]

describe('Debug', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
