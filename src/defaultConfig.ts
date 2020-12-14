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
      },
      {
        tag: "Row",
      }
    ],
    render: tagData => {
      const tableName = getContent(tagData);
      const headers = tagData.extras;
      const children = tagData?.children;
      const longestValues = headers.map(header => header.length);
      const emptyValue = '-';
      const table = [];

      function getContent (tag) {
        const value = getName(tag);

        const valueWithNewLines = value.split(`\n`).join('<br>');
        return valueWithNewLines.includes('<br>')
          ? `<pre style="margin: 0">${valueWithNewLines}</pre>`
          : valueWithNewLines;
      }

      function checkForLongestValue (colIndex, childTag) {
        const value = getContent(childTag);

        if (value?.length > longestValues?.[colIndex]) {
          longestValues[colIndex] = value.length;
        }
      }

      const toLength = (string, length, fill = ' ') => {
        const spacers = Array(length)?.fill(fill)?.join('');
        return (string + spacers).slice(0, string.length < length ? length : string.length);
      };

      // Create two dimensional table array table[row][col]
      children.forEach(child => {
        // If column, insert into table array
        if (child.tag === 'Column') {
          const columnIndex = headers.findIndex(header => header === child.extras?.[0]);
          checkForLongestValue(columnIndex, child);

          // Find first empty cell in correct column
          let rowNrToPlace = table.findIndex(row => !row?.[columnIndex]);

          // If didn't found, create new row
          if (rowNrToPlace < 0) {
            table.push(new Array(headers?.length || 0).fill(undefined));
            rowNrToPlace = table.length - 1;
          }

          // Make sure second dimension exist for table row
          if (!table[rowNrToPlace]) {
            table[rowNrToPlace] = [];
          }

          // Place child in needed position in table
          table[rowNrToPlace][columnIndex] = child;
        }

        // If Row, convert it into columns before inserting into table array
        if (child.tag === 'Row') {
          const values = child.extras;
          const rowColumns = values.map((value, valueIndex) => {
            const rowAsColumn = {
              tag: 'Column',
                alias: child.alias,
              type: child.type,
              required: child.required,
              extras: [headers[valueIndex]],
              description: value,
              content: ''
            };

            checkForLongestValue(valueIndex, rowAsColumn);
            return rowAsColumn;
          });

          // Always push to new row
          table.push(rowColumns);
        }
      });

      // Create table head as text
      const tableHead = headers
        .map((header, headerIndex) => (
          toLength(header, longestValues[headerIndex])
        ))
        .join(' | ')

      const tableHeadLine = headers
        .map((_, headerIndex) => (
          toLength('-', longestValues[headerIndex], '-')
        ))
        .join(' | ')

      // Create table body as text
      const tableBody = table
        .map(row => (
          row
            .map((col, colIndex) => (
              toLength(
                getContent(col) || emptyValue,
                longestValues[colIndex]
              )
            ))
            .join(' | ')
        ))
        .join('\n');

      // Combine all
      return arrToDoc(
        tableName,
        '',
        tableHead,
        tableHeadLine,
        tableBody,
        '',
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
          ?.join(' ') || ''

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
