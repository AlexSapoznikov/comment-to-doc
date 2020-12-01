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
    tag: "X"
  },
  {
    tag: "Table",
    children: [
      {
        tag: "Column",
        children: [
          {
            tag: "Subcol"
          },
          {
            tag: "Subcol2"
          }
        ]
      }
    ]
  }
];
