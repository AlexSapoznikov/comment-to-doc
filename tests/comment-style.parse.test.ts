/**
 * Testing parsing different comment styles
 */

import { commentParser } from "../src";

const testCases = [
  {
    in: `
      /**
       * @Tag:alias {type} [extra,data] description
       * Content
       */
    `,
    out: [{
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
    }]
  },
  {
    in: `
      /** @Tag:alias {type} [extra,data] description */
    `,
    out: [{
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "required": false,
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": ""
    }]
  },
  {
    in: `
      /* @Tag:alias {type} [extra,data] description */
    `,
    out: [{
      "tag": "Tag",
      "alias": "alias",
      "type": "type",
      "required": false,
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": ""
    }]
  },
  {
    in: `
/** @Tag:alias {type} [extra,data] description
Content
*/
    `,
    out: [{
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
    }]
  },
  {
    in: `
      /** @Tag:alias {type} [extra,data] description
       * Content
       */
    `,
    out: [{
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
    }]
  },
  {
    in: `
      /** 
       * @Tag1:alias {type} [extra,data] description
       * Content
       *
       * @Tag2:alias2
       *
       * @Tag3
       *
       * @Tag4 tag4 description
       * @Tag5
       * tag 5 content
       */
    `,
    out: [
      {
        "tag": "Tag1",
        "alias": "alias",
        "type": "type",
        "required": false,
        "extras": [
          "extra",
          "data"
        ],
        "description": "description",
        "content": "Content"
      },
      {
        "tag": "Tag2",
        "alias": "alias2",
        "type": "",
        "required": false,
        "extras": [],
        "description": "",
        "content": ""
      },
      {
        "tag": "Tag3",
        "alias": "",
        "type": "",
        "required": false,
        "extras": [],
        "description": "",
        "content": ""
      },
      {
        "tag": "Tag4",
        "alias": "",
        "type": "",
        "required": false,
        "extras": [],
        "description": "tag4 description",
        "content": ""
      },
      {
        "tag": "Tag5",
        "alias": "",
        "type": "",
        "required": false,
        "extras": [],
        "description": "",
        "content": "tag 5 content"
      }
    ]
  },
];

// These should be ignored
const ignored = [
  {
    in: `
      /** 
       * Tag1:alias {type} [extra,data] description
       * Content
       */
    `,
    out: undefined
  },
  {
    in: `
      /** 
       * Tag
       */
    `,
    out: undefined
  },
  {
    in: `
      /** 
       * Tag:alias
       */
    `,
    out: undefined
  },
  {
    in: `
      /** 
       * Tag
       * content
       */
    `,
    out: undefined
  },
  {
    in: `
      /** Tag */
    `,
    out: undefined
  },
  {
    in: `
      /* Tag */
    `,
    out: undefined
  },
  {
    in: `
      /**
      Tag
      */
    `,
    out: undefined
  },
  {
    in: `
      /*
       * Tag
       */
    `,
    out: undefined
  },
];

describe('Parse tests for different comment styles', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const parsed = commentParser(testCase.in?.trim());
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});

describe('Ignore comments that use another syntax ', () => {
  ignored.forEach(ignore => {
    it (ignore.in, () => {
      const [parsed] = commentParser(ignore.in?.trim());
      expect(parsed).toBe(undefined);
    });
  });
});
