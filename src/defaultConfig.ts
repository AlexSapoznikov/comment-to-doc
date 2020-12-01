/**
 * Default defined tags
 */

import { Tag } from "./types";
import { arrToDoc } from "./utils";

export const defaultTags: Tag[] = [
  {
    tag: "Title",
    render: tagData => {
      let hash = '#';

      // Turn alias in amount of hashes
      if (Number.isInteger(+tagData.alias)) {
        hash = Array(+tagData.alias).fill(null).join('#') + '#';
      }

      return arrToDoc(
        `${hash} ${tagData.description || tagData.content}`,
        tagData.content || undefined,
        ''
      );
    }
  },
  {
    tag: "Usage",
    render: tagData => arrToDoc(
      '## Usage',
      tagData.description || '',
      '\`\`\`',
      tagData.content,
      '\`\`\`',
      ''
    )
  },
  {
    tag: "Description",
    render: tagData => arrToDoc(
      '## Description',
      [tagData.description, tagData.content].filter(exists => exists).join('\n'),
      ''
    )
  },
  {
    tag: "Title2",
    render: tagData => arrToDoc(
      `## ${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Title3",
    render: tagData => arrToDoc(
      `### ${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Title4",
    render: tagData => arrToDoc(
      `#### ${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Title5",
    render: tagData => arrToDoc(
      `##### ${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Title6",
    render: tagData => arrToDoc(
      `###### ${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Default",
    render: tagData => arrToDoc(
      `${tagData.description || tagData.content}`,
      tagData.content || undefined,
      ''
    )
  },
  {
    tag: "Bold",
    render: tagData => arrToDoc(
      `**${tagData.description || tagData.content}**`,
      ''
    )
  },
  {
    tag: "Italic",
    render: tagData => arrToDoc(
      `*${tagData.description || tagData.content}*`,
      ''
    )
  },
  {
    tag: "Crossover",
    render: tagData => arrToDoc(
      `~~${tagData.description || tagData.content}~~`,
      ''
    )
  },
  {
    tag: "Img",
    render: tagData => arrToDoc(
      tagData.description,
      tagData.description ? '' : undefined,
      `![${tagData.extras?.[1] || ''}](${tagData.extras?.[0]})`,
      ''
    )
  },
  {
    tag: "Image",
    render: tagData => arrToDoc(
      tagData.description,
      tagData.description ? '' : undefined,
      `![${tagData.extras?.[1] || ''}](${tagData.extras?.[0]})`,
      ''
    )
  },
  {
    tag: "Quote",
    render: tagData => arrToDoc(
      tagData.content ? tagData.description : undefined,
      `> ${!tagData.content ? tagData.description : tagData.content}`,
      tagData.content ? '' : undefined,
    )
  },
  {
    tag: "Code",
    render: tagData => arrToDoc(
      `\`\`\`${tagData.type}`,
      tagData.content,
      '\`\`\`',
      ''
    )
  },
  {
    tag: "Custom",
    render: tagData => arrToDoc(
      tagData.description,
      tagData.content,
      tagData.content ? '' : undefined
    )
  },
  {
    tag: "Date",
    render: tagData => arrToDoc(
      tagData.description,
      (new Date()).toISOString().slice(0, 19).replace('T', ' '),
      ''
    )
  },
  {
    tag: "Table",
    children: [
      {
        tag: "Column",
      }
    ],
    render: tagData => {
      console.log(tagData);

      // Table name
      const tableName = [tagData.description, tagData.content]
        .filter(exists => exists)
        .join(' ') || '';

      const getColumnContent = (column) => {
        return [column.description, column.content]
          ?.filter(exists => exists)
          ?.join(' ') || ' '
      }

      // Row separator
      const createSeparator = (columnIndex) => {
        const header = tagData.extras[columnIndex];
        const children = tagData?.children.filter((_, childIndex) => (
          childIndex === (childIndex % tagData.extras?.length)
        ));
        const longestChild = children?.sort((a, b) => getColumnContent(b).length - getColumnContent(a).length)?.[0];

        const longestValue = header.length >= getColumnContent(longestChild).length
          ? header
          : getColumnContent(longestChild);

        return longestValue.replace(/./gim, '-');
      };

      // Columns
      const columns = tagData.children?.reduce((all, _, columnIndex) => {
        const scope = tagData.children?.slice(columnIndex, tagData.children?.length);
        const foundChild = scope
          .find(child => child.tag === 'Column' && child.extras?.[0] === tagData.extras[columnIndex % tagData.extras?.length])

        const foundChildContent = getColumnContent(foundChild);

        // Add column
        all = all + foundChildContent;

        if (columnIndex % tagData.extras?.length < tagData.extras?.length - 1) {
          // Add column wall
          all = all + ' | ';
        } else {
          // One row full, add separator
          all = all + '\n';
        }

        return all;
      }, '');

      return arrToDoc(
        tableName,
        tagData.extras?.join(' | '),
        tagData.extras?.map((_, i) => createSeparator(i))?.join(' | '),
        columns,
      );
    }
  }
];
