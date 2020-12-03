import * as path from 'path';
import { validate } from './checkRules';
import { Config, DocJSON, DocsJSON, ParsedComment, Tag, TagRender } from './types';
import { promisify } from 'util';
import { writeFile } from 'fs';

const writeFile$ = promisify(writeFile);

// Default JSON to doc render function
const defaultRender: TagRender = (tagData) => {
  return [
    `## ${tagData.tag}`,
    tagData?.content,
    tagData?.content ? '' : null
  ]
    .filter(line => line !== null)
    .join('\n');
};

export const createDocs = async (docsJSON: DocsJSON, tags: Tag[], config: Config) => {
  // console.log('docsJSON', JSON.stringify(docsJSON, null, 2));
  // console.log('tags', tags);

  const outputs = await Promise.all(
    docsJSON.map(doc => writeToFile(doc, tags, config))
  );

  docsJSON.forEach((docJSON, i) => docJSON.output = outputs[i]);

  return docsJSON;
}

async function writeToFile (doc: DocJSON, tags: Tag[], config: Config) {
  const documentText: string[] = [];
  const docName = path.basename(doc.path, path.extname(doc.path));
  const docPath = path.dirname(doc.path);
  const docExt = config.outputExt;
  const outputPath = config?.output?.(docPath, docName) ?? `${docPath}/${docName}.${docExt ?? 'md'}`;
  const isStrictTags = config?.strict;

  validate(doc, config);

  // Combine data
  doc?.data.forEach((tagData: ParsedComment) => {
    const tagOpts = tags.find(tag => tag.tag === tagData.tag);
    const render = tagOpts?.render || defaultRender;

    // If tag does not exist in "tags" array and is forbidden to use, do not use it
    if (isStrictTags && !tagOpts) {
      return;
    }

    // Add rendered comment to document text array
    documentText.push(
      render(tagData)
    );
  });

  // Write to file
  await writeFile$(
    outputPath,
    documentText.join(`\n`),
    {
      encoding: 'utf8',
      flag: 'w'
    });

  return outputPath;
}
