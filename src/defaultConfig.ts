/**
 * Default defined tags
 */

import { Tag } from "./types";
import { arrToDoc } from "./utils";

const defaultTags: Tag[] = [
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
      const getContent = (tag) => {
        const value = getName(tag);

        const valueWithNewLines = value.split(`\n`).join('<br>');
        return valueWithNewLines.includes('<br>')
          ? `<pre style="margin: 0">${valueWithNewLines}</pre>`
          : valueWithNewLines;
      }

      const toLength = (string, length) => {
        const spacers = Array(length)?.fill(' ')?.join('');
        return (string + spacers).slice(0, string.length < length ? length : string.length);
      };

      // Table name
      const tableName = getContent(tagData);
      const headers = tagData.extras;
      const columns = headers.map(header => [header]); // [[header1], [header2], [header3], ...]
      const cells = tagData?.children;
      let table = '';

      // Find columns - [[header1, col1, ...], [header2, col2, ...], [header3, col3, ...], ...]
      cells?.forEach(cell => {
        if (cell.tag === 'Column') {
          const foundColumn = columns.find(header => header?.[0] === cell.extras?.[0]);
          foundColumn.push(
            getContent(cell)
          );
        }
      });

      // Fill missing cells with "-"
      headers.forEach((_, columnIndex) => {
        columns.forEach((_, rowIndex) => {
          columns[rowIndex][columnIndex] = columns[rowIndex][columnIndex] || '-';
        });
      });

      // Make all cols same length
      headers.forEach((_, columnIndex) => {
        const longestInCol = [...columns[columnIndex]]
          ?.sort((a, b) => b.length - a.length)
          ?.[0];
        const length = longestInCol?.length;

        columns[columnIndex].forEach((_, cellIndex) => {
          const value = columns[columnIndex][cellIndex];
          columns[columnIndex][cellIndex] = toLength(value, length);
        });
      });

      const longestColumns = columns.sort((a, b) => b.length - a.length);

      // Create table
      longestColumns?.[0].forEach((_, columnIndex) => {
        columns.forEach((_, rowIndex) => {
          const value = columns?.[rowIndex]?.[columnIndex] || '-';
          table += (value + ' | ');
        });

        // Next row
        table += '\n';

        // Add horizontal separator under headers
        if (columnIndex === 0) {
          headers.forEach((_, headerIndex) => {
            const colSeparator = Array(columns?.[headerIndex]?.[columnIndex].length).fill('-').join('');
            table += colSeparator + ' | ';
          });
          table += '\n';
        }
      });

      return arrToDoc(
        tableName,
        '',
        table,
      );
    }
  },
  {
    tag: "Object",
    children: [
      {
        tag: "Key",
      }
    ],
    render: tagData => {
      const objectName = getName(tagData);

      const keys = tagData?.children?.filter(exists => exists) || [];
      const parentNames = keys?.map(c => c?.extras?.[0]);
      let objectDoc = '';

      keys.forEach(objectKey => {
        const [key, defaultValue] = objectKey.extras;
        const isRequired = objectKey.required
          ? `  <span style="color: #f3454c">required</span>`
          : '';
        const nested = key?.split('.') || [''];
        let place = nested?.length - 1;

        // Remove place for each parent that does not exist
        for (let i = 0; i < nested.length; i++) {
          const possibleParent = nested?.slice?.(0, nested?.length - 1 - i)?.join('.');
          const parentExists = parentNames?.includes?.(possibleParent);

          if (!parentExists && place > 0) {
            place--;
          } else {
            break;
          }
        }

        const spacer = Array(place).fill('  ').join('');
        const keyName = nested?.[nested?.length - 1];

        const keyNameText = place < (nested.length - 1)
          ? nested?.slice(place)?.join('.')
          : keyName || '<unspecified key>';

        const description = [objectKey?.description, objectKey?.content]
          ?.filter(exists => exists)
          ?.join(' ') || '';

        const defaultValueText = (defaultValue ? ` *(default: ${defaultValue})*` : '');
        const typeText = objectKey?.type ? ` \`${objectKey?.type}\`` : '';

        objectDoc += [
          `${spacer}- **${keyNameText}**` + typeText + defaultValueText + isRequired + `\n`,
          description.trim() ? `${spacer}  ${description}\n` : undefined,
          ''
        ]
          .filter(exists => exists || exists === '')
          .join('\n');
      });

      return arrToDoc(
        objectName,
        objectDoc
      );
    }
  },
];

function getName (tag) {
  return [tag?.description, tag?.content]
    ?.filter(exists => exists)
    ?.join(' ') || ''
}

export default defaultTags;
