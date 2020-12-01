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
