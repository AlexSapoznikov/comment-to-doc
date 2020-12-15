/**
 * Parser tests
 *
 * Following comment structure should be parsed when some parts of it are missing:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

import { commentParser } from "../src";

const combinations = {
  'tag': [
    ['@Test',                           'Test']
  ],
  'alias': [
    ['', ''],
    [':name',                           'name'],
  ],
  'type':  [
    ['',                                '', false],
    ['{TestType}',                      'TestType', false],
    ['{ TestType}',                     'TestType', false],
    ['{TestType }',                     'TestType', false],
    ['{ TestType }',                    'TestType', false],
    [' { TestType }',                   'TestType', false],
    [' { TestType }  ',                 'TestType', false],
    [' {   TestType  }  ',              'TestType', false],

    ['{!}',                             '', true],
    ['{TestType!}',                     'TestType', true],
    ['{ TestType!}',                    'TestType', true],
    ['{TestType! }',                    'TestType', true],
    ['{ TestType! }',                   'TestType', true],
    [' { TestType! }',                  'TestType', true],
    [' { TestType! }  ',                'TestType', true],
    [' {   TestType ! }  ',             'TestType', true],
    [' {   TestType    !}  ',           'TestType', true],

    [' {  ! TestType  }  ',             '! TestType', false],
    [' {!TestType}  ',                  '!TestType', false],
    [' {!TestType!}  ',                 '!TestType', true],
    [' {TestT!ype}  ',                  'TestT!ype', false],
    [' {!TestT!ype!}  ',                '!TestT!ype', true],
    [' {TestType!!}  ',                 'TestType!', true],
    [' {Te!stType!!  ! }  ',            'Te!stType!!', true],

    ['{{}}',                            '{}', false],
    ['{{ a: 1, b: 2}}',                 '{ a: 1, b: 2}', false],
    ['{{a{{} {}}}}',                    '{a{{} {}}}', false],
    ['{}',                              '', false],
  ],
  'extras': [
    ['',                                []],
    ['[extra]',                         ['extra']],
    ['[extra,data]',                    ['extra', 'data']],
    ['[extra,data,more]',               ['extra', 'data', 'more']],
    ['[ extra,data,more]',              ['extra', 'data', 'more']],
    ['[extra, data,more]',              ['extra', 'data', 'more']],
    ['[extra,data, more]',              ['extra', 'data', 'more']],
    ['[extra,data,more ]',              ['extra', 'data', 'more']],
    ['[ extra, data,more]',             ['extra', 'data', 'more']],
    ['[ extra, data, more]',            ['extra', 'data', 'more']],
    ['[ extra, data, more ]',           ['extra', 'data', 'more']],
    ['[ extra  , data ,more ]',         ['extra', 'data', 'more']],
    ['[ extra  , data ,more ]',         ['extra', 'data', 'more']],
    ['  [ extra  , data ,more ]   ',    ['extra', 'data', 'more']],

    ['[extra, data[], more ]',          ['extra', 'data[]', 'more']],
    ['[extra, data[[]], more ]',        ['extra', 'data[[]]', 'more']],
    ['[extra, data[][], more ]',        ['extra', 'data[][]', 'more']],
    ['[extra, data[[][]], more ]',      ['extra', 'data[[][]]', 'more']],
  ],
  'description': [
    '',
    'my nice description about the component',
    'oneword',
  ],
  'content': [
    '',
    'The content of the comment that I want to render in documentation',
    'oneword'
  ],
}

const specialCases = [
  // Unable to parse type
  {
    in: `
      /**
       * @Tag:alias {{{ tere}} [extra,data] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "",
      "required": false,
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": "Content"
    }
  },

  // Unable to parse type
  {
    in: `
      /**
       * @Tag:alias {}{} [extra,data] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "",
      "required": false,
      "extras": [
        "extra",
        "data"
      ],
      "description": "description",
      "content": "Content"
    }
  },

  // Unable to parse extras
  {
    in: `
      /**
       * @Tag:alias {test} [extra, data[[], more ] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "test",
      "required": false,
      "extras": [],
      "description": "[extra, data[[], more ] description",
      "content": "Content"
    }
  },

  // Unable to parse extras
  {
    in: `
      /**
       * @Tag:alias {test} [][] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "alias",
      "type": "test",
      "required": false,
      "extras": [
        ''
      ],
      "description": "[] description",
      "content": "Content"
    }
  },

  // Unable to parse type and extras
  {
    in: `
      /**
       * @Tag {{{ tere}} [extra, data[[], more ] description
       * Content
       */
    `,
    out: {
      "tag": "Tag",
      "alias": "",
      "type": "",
      "required": false,
      "extras": [],
      "description": "{{{ tere}} [extra, data[[], more ] description",
      "content": "Content"
    }
  },
];

function combinationsToTestCases (combinations) {
  const tests = [];

  combinations.tag.forEach(tag => {
    combinations.alias.forEach(alias => {
      combinations.type.forEach(type => {
        combinations.extras.forEach(extras => {
          combinations.description.forEach(description => {
            combinations.content.forEach(content => {
              tests.push(
                {
                  in: `
                  /**
                   * ${tag[0]}${alias[0]} ${type[0]} ${extras[0]} ${description}
                   * ${content}
                   */ 
                `,
                  out: {
                    tag: tag[1],
                    alias: alias[1],
                    type: type[1],
                    required: type[2],
                    extras: extras[1],
                    description: description,
                    content: content,
                  }
                }
              );
            });
          });
        });
      });
    });
  });

  return [...tests];
}

describe('Incomplete structure parser tests', () => {
  const testCases = combinationsToTestCases(combinations);

  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });

  specialCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
