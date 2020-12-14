import * as path from 'path';
import { validate } from './checkRules';
import { Config, DocJSON, DocsJSON, ParsedComment, Tag, TagRender } from './types';
import { promisify } from 'util';
import { writeFile } from 'fs';
import * as fs from 'fs';
import * as chalk from 'chalk';
import { getOutput } from "./utils";

const writeFile$ = promisify(writeFile);

const writtenOutputs = [];

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

  // Serially so files in same directory would not conflicts with each other
  for (const doc of docsJSON) {
    doc.output = await writeToFile(doc, tags, config);
  }

  return docsJSON;
}

async function writeToFile (doc: DocJSON, tags: Tag[], config: Config) {
  const documentText: string[] = [];
  const outputPath = doc.output || getOutput(doc, config);
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
    try {
      documentText.push(
        render(tagData)
      );
    } catch (err) {
      console.log(
        chalk.red(`Render ignored. Error occurred in @${tagOpts?.tag} render method.`)
      );
      console.log('Error info:', err);
    }
  });

  // New line at the end of file
  documentText.push('');

  // Write to file
  ensureDirectoryExistence(outputPath);
  await writeFile$(
    outputPath,
    documentText.join(`\n`),
    {
      encoding: 'utf8',
      flag: writtenOutputs.includes(outputPath) ? 'a' : 'w',
    });

  writtenOutputs.push(outputPath);

  return outputPath;
}

function ensureDirectoryExistence (filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname, { recursive: true });
}
