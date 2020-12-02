"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.parseChildren = void 0;
var utils_1 = require("./utils");
/**
 * Finds children tags
 */
var findChildTags = function (docsJSON, tags) {
    return docsJSON.map(function (docJSON) { return (__assign(__assign({}, docJSON), { data: parseChildren(docJSON.data, tags) })); });
};
function parseChildren(tagData, tags) {
    var tagsMap = createTagsMap(tags);
    return moveChildrenToParents(tagData, tagsMap);
}
exports.parseChildren = parseChildren;
function createTagsMap(tags, map, parent) {
    if (map === void 0) { map = {}; }
    tags === null || tags === void 0 ? void 0 : tags.forEach(function (tag) {
        map[tag.tag] = tag;
        // Attach parent (without children) if exists
        if (parent) {
            var p = __assign({}, parent);
            delete p.children;
            map[tag.tag].parent = p;
        }
        // Recursive check
        if (tag.children) {
            createTagsMap(tag.children, map, tag);
        }
    });
    return map;
}
function moveChildrenToParents(tagData, tagsMap) {
    var _a;
    for (var index = tagData.length - 1; index >= 0; index--) {
        var parsedTag = tagData[index];
        var parent_1 = (_a = tagsMap === null || tagsMap === void 0 ? void 0 : tagsMap[parsedTag === null || parsedTag === void 0 ? void 0 : parsedTag.tag]) === null || _a === void 0 ? void 0 : _a.parent;
        if (parent_1) {
            // Move child to children array (will reverse children)
            tagData = moveChild(tagData, index, parsedTag, parent_1);
        }
    }
    // Reverse children back
    reverseChildrenDeep(tagData);
    return tagData;
}
function moveChild(tagData, index, child, parent) {
    // Find parent
    var findParent = function (tagDataPartial, child, parentName) {
        return utils_1.findLast(tagDataPartial, function (tag) {
            // Match tag name and alias as well if exists
            var isMatch = tag.tag === parent.tag && (child.alias ? tag.alias === child.alias : true);
            // Recursive
            if (tag.children) {
                return findParent(tag.children, child, parentName) || isMatch;
            }
            return isMatch;
        });
    };
    // // Reverse so we will find last previous parent first
    var foundParent = findParent(tagData.slice(0, index), child, parent.tag);
    // If parent found, move child to its children and remove from current tree level
    if (foundParent) {
        foundParent.children = foundParent.children || [];
        foundParent.children.push(child);
    }
    tagData.splice(index, 1);
    return tagData;
}
function reverseChildrenDeep(tagData) {
    tagData.forEach(function (parsedTag) {
        var children = parsedTag === null || parsedTag === void 0 ? void 0 : parsedTag.children;
        if (children === null || children === void 0 ? void 0 : children.length) {
            children.reverse();
            reverseChildrenDeep(children);
        }
    });
}
exports["default"] = findChildTags;
