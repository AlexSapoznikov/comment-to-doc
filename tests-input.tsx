// =============
// == TITLES ===
// =============

/**
 * @Title My title
 */

/**
 * @Title My title with content
 * My title 2
 */

/**
 * @Title My title with description and content
 * Content
 */

/**
 * @Title2 title2
 * @Title:2 title:2
 * @Title3 title3
 * @Title:3 title:3
 * @Title4 title4
 * @Title:4 title:4
 * @Title5 title5
 * @Title:5 title:5
 * @Title6 title6
 * @Title:5 title:6
 *
 */

// =============
// == TEXT =====
// =============

/**
 * @Bold my bold text
 * @Italic my italic text
 * @Crossover my crossed over text
 */

// ==============
// == IMAGE =====
// ==============

/**
 * @Img [https://picsum.photos/200/300, alt text] My image
 * @Img [https://picsum.photos/200/300] My image
 * @Img [https://picsum.photos/200/300]
 * @Image [https://picsum.photos/200/300]
 */

// ==============
// == QUOTE =====
// ==============

/**
 * @Quote As Kanye West said:
 * I like myself the most
 * @Quote To be or not to be
 * @Quote
 * This library is so amazing
 */

// ==============
// == CODE ======
// ==============

/**
 * @Code {javascript}
   function fancyAlert(arg) {
     if(arg) {
      $.facebox({div:'#foo'})
     }
   }
 */

/**
 * @Code
 * function fancyAlert(arg) {
 *   if(arg) {
 *     $.facebox({div:'#foo'})
 *   }
 * }
 */

// ==============
// == USAGE =====
// ==============

/**
 * @Usage In order to use, include it like this:
 * testtest
 */

// ===============
// == CUSTOM =====
// ===============

/**
 * @Custom ### My custom
 *
 * @Custom ### My custom 2
 * **custom *text* for my ~~custom~~ content**
 */

// ====================
// == DESCRIPTION =====
// ====================

/**
 * @Description my description
 *
 * @Description my description
 * more description if I want
 */

// ==============
// == DATE =====
// ==============

/**
 * @Date Created at
 */

// ============
// == TABLE ===
// ============

/**
 * @Table [header1, header2, header3] ##my table name
 */

/**
 * @Column [header1] First row
 * Content for first cell
 */

/**
 * @Column [header2] First row
 * Content for second cell
 */

/**
 * @Column [header3]
 * Short
 */

/**
 * @Column [header1] Second row
 * Content for first cell
 */

/**
 * @Column [header2] Second row
 * Content for second cell which is a bit longer
 */

/**
 * @Column [header3]
 * Short
 */

/**
 * @Custom custom
 */

// =============
// == OBJECT ===
// =============

/** @Object a */
const a = {
  /**
   * @Key {string} [hello,world] world
   */
  hello: 'world',
  /**
   * @Key {string} [hi,john] John
   */
  hi: 'John',
  /**
   * @Key {object} [nested]
   */
  nested: {
    /**
     * @Key {string} [nested.kanye]
     */
    kanye: 'west',
    /**
     * @Key [nested.all]
     */
    all: {
      /**
       * @Key {number} [nested.all.right] right
       */
      right: '3',

      /**
       * @Key {object} [nested.all.more] yes
       */
      more: {

        /**
         * @Key {string} [nested.all.right.ok] right
         * okasy so here is a bit bigger descrioption about the thing
         * bheauas xasd ae
         */
        ok: 'ok'
      }
    }
  }
}
