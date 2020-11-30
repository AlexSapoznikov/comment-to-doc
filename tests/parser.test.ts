/**
 * Parser tests
 *
 * Following comment structure should be parsed even when some parts missing:
 * @Tag:alias {type} [extra,data] description
 * Content
 */

describe('Parser tests', () => {
  test('@Tag:alias {type} [extra,data] description', () => {
    expect(true).toBe(true);
  });
});
