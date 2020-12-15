import * as path from 'path';
import { Config, DocJSON } from './types';
import * as urlJoin from 'url-join';

/**
 * Flatten array [[..., ...], ...] => [..., ..., ...]
 * @param arr
 */
export function flattenArr (arr: any[]): any[] {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten);
  }, []);
}

/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export function findLast<T>(array: T[], predicate: (value: T, index?: number, obj?: T[]) => boolean): T|null {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) {
      return array[l];
    }
  }
  return null;
}

/**
 * Convert array of strings into doc
 * @param array
 */
export const arrToDoc = (...array: string[]): string => (
  array
    ?.filter(exists => exists || exists === '')
    ?.join('\n')
);

/**
 * Gets amount of letters
 * @param letter
 * @param str
 */
export const amountOfLetters = (letter: string, str: string) => {
  const regexp = new RegExp(`[^\\${letter}]`, 'g');
  return str.replace(regexp, "").length;
}

/**
 * Parse text and get indexes of start and end brackets
 * @param startBracket
 * @param endBracket
 * @param text
 */
export const getBracketIndexes = (startBracket: string, endBracket: string, text: string): { startIndex: number, endIndex: number } => {
  let startIndex = -1;
  let endIndex = -1;
  let openCount = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === startBracket) {
      if (startIndex < 0) {
        startIndex = i;
      }
      openCount++;
    }

    if (text[i] === endBracket) {
      if (openCount > 0) {
        openCount--;
      }

      if (openCount === 0 && endIndex < 0) {
        endIndex = i;
        break;
      }
    }
  }

  return {
    startIndex,
    endIndex
  }
}

/**
 * Gets n'ts indexOf
 * @param str
 * @param pat
 * @param n
 */
export const nthIndexOf = (str, pat, n) => {
  const L = str.length;
  let i = -1;

  while (n-- && i++ < L){
    i = str.indexOf(pat, i);
    if (i < 0) {
      break;
    }
  }
  return i;
}

export const getOutput = (doc: DocJSON, config: Config): string => {
  const docName = path.basename(doc.path, path.extname(doc.path));
  const docPath = path.dirname(doc.path);
  const docExt = config.outputExt;
  return typeof config?.output === 'function'
    ? urlJoin(process.cwd(), config?.output?.(docPath, docName))
    : `${docPath}/${docName}.${docExt ?? 'md'}`;
}
