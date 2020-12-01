"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLast = exports.flattenArr = void 0;
/**
 * Flatten array [[..., ...], ...] => [..., ..., ...]
 * @param arr
 */
function flattenArr(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArr(toFlatten) : toFlatten);
    }, []);
}
exports.flattenArr = flattenArr;
/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
function findLast(array, predicate) {
    var l = array.length;
    while (l--) {
        if (predicate(array[l], l, array)) {
            return array[l];
        }
    }
    return null;
}
exports.findLast = findLast;
