import { readFiles } from './readFiles';
import { getDocsJSON, parser } from "./getDocsJSON";
import { createDocs } from './createDoc';
import { Config, Tag } from "./types";
import findChildTags, { parseChildren } from "./getChildren";
import applyOrdering from "./ordering";
import group from "./group";

/**
 * Export types
 */
export * from "./types";

/**
 * Export default config
 */
export { default as defaultTags } from './defaultConfig';

/**
 * Comment parser.
 * Pass defaultTags in tags if default children need to be parsed.
 *
 * @param comments
 * @param tags
 */
export const commentParser = (comments: string, tags: Tag[] = []) => {
  const parsed = parser(comments);
  return parseChildren(parsed, tags);
}

/**
 * Documentation generator
 * @param config
 */
const generateDocs = async (config: Config) => {
  const tags = config?.tags || [];
  const filePaths = config?.files && Array.isArray(config.files) ? config.files : [config.files];
  const excludeFilePaths = config?.excludeFiles && Array.isArray(config.excludeFiles) ? config.excludeFiles : [config.excludeFiles];

  // Get file contents
  const fileContents = await readFiles(filePaths as string[], {
    ignore: (excludeFilePaths as string[]).filter(exists => exists)
  });

  // Parse contents
  let docsJSON = getDocsJSON(fileContents);

  // Find children tags
  docsJSON = findChildTags(docsJSON, tags);

  // Group by output
  docsJSON = group(docsJSON, config);

  // Reorder
  docsJSON = applyOrdering(docsJSON, config);

  // Generate docs
  docsJSON = await createDocs(docsJSON, tags, config);

  // Return docsJSON
  return docsJSON;
};

export default generateDocs;
