/**
 * Parser tests
 *
 * Following comment structure should be parsed:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import { testParser } from "./utils/parser";

const fullStructureOut = {
  "tag": "Tag",
  "alias": "alias",
  "type": "type",
  "extras": [
    "extra",
    "data"
  ],
  "description": "description",
  "content": "Content"
};

const testCases = [
  {
    in: `
      /**
       * @Tag:alias {type} [extra,data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias { type} [extra,data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type } [extra,data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias { type } [extra,data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type} [ extra,data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type} [extra, data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type} [extra,data ] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type} [ extra, data] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {type} [ extra, data ] description
       * Content
       */
    `,
    out: fullStructureOut
  },
  {
    in: `
      /**
       * @Tag:alias {  type   } [  extra,   data  ]    description
       *   Content
       */
    `,
    out: fullStructureOut
  }
]

describe('Full structure parse tests', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = testParser(testCase.in);
      console.log(JSON.stringify(parsed, null, 2))
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
