/**
 * Parser tests
 *
 * Following comment structure should be parsed:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import { commentParser } from "../src";

const fullStructureOut = {
  "tag": "Tag",
  "alias": "alias",
  "type": "type",
  "required": false,
  "extras": [
    "extra",
    "data"
  ],
  "description": "description",
  "content": "Content"
};

const fullStructureOutRequired = {
  ...fullStructureOut,
  required: true
}

// ================
// WITHOUT REQUIRED
// ================
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
  },
];

// =============
// WITH REQUIRED
// =============
const testCasesWithRequired = [
  {
    in: `
      /**
       * @Tag:alias {type!} [extra,data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias { type!} [extra,data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type! } [extra,data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias { type !} [extra,data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type!} [ extra,data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type!} [extra, data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type!} [extra,data ] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type!} [ extra, data] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {type!} [ extra, data ] description
       * Content
       */
    `,
    out: fullStructureOutRequired
  },
  {
    in: `
      /**
       * @Tag:alias {  type  ! } [  extra,   data  ]    description
       *   Content
       */
    `,
    out: fullStructureOutRequired
  }
];

describe('Full structure parse tests without required type', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});

describe('Full structure parse tests with required type', () => {
  testCasesWithRequired.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
