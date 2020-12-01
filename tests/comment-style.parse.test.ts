/**
 * Testing parsing different comment styles
 */

import { testParser } from "./utils/parser";

const testCases = [
  {
    in: `
      /**
       * @Tag:alias {type} [extra,data] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": "Content"
    }
  },
  {
    in: `
      /** @Tag:alias {type} [extra,data] description */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": ""
    }
  },
  {
    in: `
      /* @Tag:alias {type} [extra,data] description */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": ""
    }
  },
  {
    in: `
      /** @Tag:alias {type} [extra,data] description
      Content
      */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": "Content"
    }
  },
  {
    in: `
      /** @Tag:alias {type} [extra,data] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": "Content"
    }
  },
]

describe('Parse tests for different comment styles', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = testParser(testCase.in);
      console.log(JSON.stringify(parsed, null, 2))
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
