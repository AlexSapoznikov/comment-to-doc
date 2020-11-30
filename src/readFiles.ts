import { readFile } from 'fs';
import { promisify } from 'util';
import glob from 'glob';
import { flattenArr } from './utils';
import { FileContent, GlobOpts } from './types';

// Promisify some methods
const getFilePaths = promisify(glob);
const readFileAsync = promisify(readFile);

// Default glob options
const globDefaultOptions = {
  nodir: true,
};

/**
 * Read all files
 * @param filePaths
 * @param globOptions
 */
export const readFiles = async (filePaths: string[], globOptions: GlobOpts): Promise<FileContent[]> => {
  // Get file paths
  const files = await Promise.all(
    filePaths.map(filePath => getFiles(filePath, globOptions))
  );

  // Flatten results
  const allFilePaths = flattenArr(files);

  // Get all file contents
  const allFileContents = await Promise.all(
    allFilePaths.map(filePath => readFileAsync(filePath, 'utf-8').catch(() => ''))
  );

  // Merge paths and contents
  return allFilePaths.map((filePath, index) => ({
    path: filePath,
    content: allFileContents[index]
  }));
}

/**
 * Get all file paths
 * @param filePath
 * @param globOptions
 */
async function getFiles (filePath: string, globOptions: GlobOpts) {
  return getFilePaths(
    filePath,
    {
      ...globDefaultOptions,
      ...(globOptions || {}),
    },
  );
}
