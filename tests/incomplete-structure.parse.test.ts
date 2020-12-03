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

const testCases = [];

combinations.tag.forEach(tag => {
  combinations.alias.forEach(alias => {
    combinations.type.forEach(type => {
      combinations.extras.forEach(extras => {
        combinations.description.forEach(description => {
          combinations.content.forEach(content => {
            testCases.push(
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

describe('Incomplete structure parser tests', () => {
  testCases.forEach(testCase => {
    it (testCase.in, () => {
      const [parsed] = commentParser(testCase.in);
      expect(parsed).toMatchObject(testCase.out);
    });
  });
});
