/**
 * Testing parsing different comment styles
 */

import { commentParser, defaultTags } from "../src";

const content = `
/**
 * =======================
 * == FIRST TABLE ========
 * =======================
 */ 

/**
 * @Table [header1, header2, header3] ##my table name
 */

/**
 * @Column [header1] column 1 1
 * content 1 1
 */

/**
 * @Column [header2] column 1 2
 * content 1 2
 */

/**
 * @Column [header3] column 1 3
 * content 1 3
 */

/**
 * @Column [header1] column 2 1
 * content 2 1
 */

/**
 * @Column [header2] column 2 2
 * content 2 2
 */

/**
 * @Column [header3] column 2 3
 * content 2 3
 */

/**
 * =======================
 * == SECOND TABLE =======
 * =======================
 */ 

/**
 * @Table [header1, header2] ##my table name
 *
 * @Column [header1] column 3 1
 * content 3 1
 *
 * @Column [header2] column 3 2
 * content 3 2
 */
 
/**
 * =============================
 * == THIRD and FOURTH TABLE ===
 * =============================
 *
 * @Table:alias [h1, h2]
 * @Table:saila [h1, h2]
 * 
 * @Column:alias [header1] column 4 1
 * content 4 1
 *
 * @Column:saila [header1] column 5 1
 * content 5 1
 *
 * @Column:alias [header2] column 4 2
 * content 4 2
 *
 * @Column:saila [header1] column 5 2
 * content 5 2
 *
 */ 
`.trim();

describe('Children tag tests', () => {
  it ('Children should be placed correctly under parent', () => {
    const parsed = commentParser(content, defaultTags);

    // Amount of tables
    expect(parsed.length).toBe(4);

    // FIRST TABLE
    expect(parsed[0].tag).toBe('Table');

    // Check children
    expect(parsed[0].children.length).toBe(6);
    parsed[0].children.forEach((child, childIndex) => {
      expect(child.tag).toBe('Column');

      const order = [
        '1 1',
        '1 2',
        '1 3',
        '2 1',
        '2 2',
        '2 3',
      ];
      expect(child.description).toBe(`column ${order[childIndex]}`);
      expect(child.content).toBe(`content ${order[childIndex]}`);
    });

    // SECOND TABLE
    expect(parsed[1].tag).toBe('Table');

    // Check children
    expect(parsed[1].children.length).toBe(2);
    parsed[1].children.forEach((child, childIndex) => {
      expect(child.tag).toBe('Column');

      const order = [
        '3 1',
        '3 2',
      ];
      expect(child.description).toBe(`column ${order[childIndex]}`);
      expect(child.content).toBe(`content ${order[childIndex]}`);
    });

    // THIRD TABLE
    expect(parsed[2].tag).toBe('Table');

    // Check children
    expect(parsed[2].children.length).toBe(2);
    expect(parsed[2].alias).toBe('alias');

    parsed[2].children.forEach((child, childIndex) => {
      expect(child.tag).toBe('Column');
      expect(child.alias).toBe('alias');

      const order = [
        '4 1',
        '4 2',
      ];
      expect(child.description).toBe(`column ${order[childIndex]}`);
      expect(child.content).toBe(`content ${order[childIndex]}`);
    });

    // FOURTH TABLE
    expect(parsed[3].tag).toBe('Table');
    expect(parsed[3].alias).toBe('saila');

    // Check children
    expect(parsed[3].children.length).toBe(2);
    parsed[3].children.forEach((child, childIndex) => {
      expect(child.tag).toBe('Column');
      expect(child.alias).toBe('saila');

      const order = [
        '5 1',
        '5 2',
      ];
      expect(child.description).toBe(`column ${order[childIndex]}`);
      expect(child.content).toBe(`content ${order[childIndex]}`);
    });
  });
});
