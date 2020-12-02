import { readFiles } from './readFiles';
import { getDocsJSON } from "./getDocsJSON";
import { createDocs } from './createDoc';
import { Config } from './types';
import findChildTags from './getChildren';

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

  // Generate docs
  return createDocs(docsJSON, tags, config);
};

export default generateDocs;

export { parser } from "./getDocsJSON";
