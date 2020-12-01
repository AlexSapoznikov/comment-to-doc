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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocsJSON = void 0;
var utils_1 = require("./utils");
var getDocsJSON = function (fileContents) {
    return fileContents.map(function (fileContent) { return ({
        path: fileContent.path,
        data: parseComments(parseContent(fileContent.content))
    }); });
};
exports.getDocsJSON = getDocsJSON;
function parseContent(content) {
    var _a;
    var currentContentPart = content;
    var tagIndex = 0;
    var comments = [];
    while (tagIndex >= 0) {
        // Find comment start and end index
        tagIndex = currentContentPart.indexOf('/*');
        // If no more indexes found, stop loop
        if (tagIndex < 0) {
            break;
        }
        // Get comment
        var commentStart = currentContentPart.slice(tagIndex);
        var endIndex = commentStart.indexOf('*/');
        endIndex = endIndex < 0 ? 0 : endIndex;
        var comment = (_a = commentStart === null || commentStart === void 0 ? void 0 : commentStart.slice(commentStart.indexOf('@'), endIndex)) === null || _a === void 0 ? void 0 : _a.trim();
        // Save comment
        comments.push(comment);
        // Slice content so we could search for next comment
        currentContentPart = currentContentPart.slice(tagIndex + (comment.length || 1));
    }
    return comments;
}
/**
 * Parse comments
 * @param fileComments
 */
function parseComments(fileComments) {
    // Handle multiple tags inside single comment
    fileComments = handleMultiTagsInSingeComment(fileComments);
    return fileComments.map(function (comment) {
        var _a;
        var parsedCommentLines = comment
            .split('\n')
            .map(function (commentLine, index) {
            var isTagComment = index === 0;
            // Trim it
            commentLine = commentLine.trim();
            // Remove symbols
            commentLine = commentRemoveSymbols(commentLine);
            // If first line, the it is a tag
            if (isTagComment) {
                return extractTagData(commentLine);
            }
            // Return comment line
            return commentLine;
        })
            .filter(function (exists) { return exists; });
        // Tag data
        var tagData = (_a = parsedCommentLines.splice(0, 1)) === null || _a === void 0 ? void 0 : _a[0];
        // Under tag comment
        var underTagComment = parsedCommentLines.join('\n');
        return __assign(__assign({}, tagData), { content: underTagComment });
    });
}
/**
 * Handle multi tags in same comment
 * @param fileComments
 */
function handleMultiTagsInSingeComment(fileComments) {
    var separatedComments = fileComments
        .map(function (comment) { return comment.split('@'); });
    // Flatten array and remove empty comments
    return utils_1.flattenArr(separatedComments)
        .filter(function (exists) { return !!exists.trim(); });
}
/**
 * Remove symbols
 * @param comment
 */
function commentRemoveSymbols(comment) {
    var removeSymbols = ['*', '@'];
    var modifiedComment = removeSymbols.some(function (symbol) { return comment.startsWith(symbol); })
        ? comment.slice(1)
        : comment;
    return modifiedComment === null || modifiedComment === void 0 ? void 0 : modifiedComment.trim();
}
/**
 * Extract tag, type, description
 * @param tagComment
 */
function extractTagData(tagComment) {
    var spaceExists = function (string) { return string.indexOf(' ') >= 0; };
    var tag = tagComment;
    var alias = '';
    var type = '';
    var description = '';
    var extras = [];
    // If no type or description exist
    if (spaceExists(tagComment)) {
        // Comment chunk that lefts after each extract
        var commentChunk = tagComment;
        // Extract tag
        var extractedTag = extractTag(commentChunk);
        tag = extractedTag.tag;
        alias = extractedTag.alias;
        commentChunk = extractedTag.commentChunk;
        // Extract type
        var extractedType = extractType(commentChunk);
        type = extractedType.type;
        commentChunk = extractedType.commentChunk;
        // Extract extras
        var extractedExtras = extractExtras(commentChunk);
        extras = extractedExtras.extras;
        commentChunk = extractedExtras.commentChunk;
        // Extract description
        var extractedDescription = extractDescription(commentChunk);
        description = extractedDescription.description;
        commentChunk = extractedDescription.commentChunk;
    }
    // Return extracted data
    return {
        tag: tag,
        alias: alias,
        type: type,
        extras: extras,
        description: description
    };
}
function extractTag(commentChunk) {
    var _a;
    var tagEndIndex = commentChunk.indexOf(' ');
    var _b = (_a = commentChunk.slice(0, tagEndIndex)) === null || _a === void 0 ? void 0 : _a.split(':'), tag = _b[0], alias = _b[1];
    commentChunk = commentChunk.slice(tagEndIndex);
    return {
        tag: tag,
        alias: alias || '',
        commentChunk: commentChunk
    };
}
function extractType(commentChunk) {
    var _a;
    var type = '';
    var typeIndexStart = commentChunk.indexOf('{');
    var typeIndexEnd = commentChunk.indexOf('}');
    // Extract type
    if (typeIndexStart >= 0 && typeIndexEnd > typeIndexStart) {
        type = ((_a = commentChunk === null || commentChunk === void 0 ? void 0 : commentChunk.slice(typeIndexStart + 1, typeIndexEnd)) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        commentChunk = commentChunk.slice(typeIndexEnd + 1);
    }
    return {
        type: type,
        commentChunk: commentChunk
    };
}
function extractExtras(commentChunk) {
    var _a, _b;
    var extras = [];
    var typeIndexStart = commentChunk.indexOf('[');
    var typeIndexEnd = commentChunk.indexOf(']');
    // Extract type
    if (typeIndexStart >= 0 && typeIndexEnd > typeIndexStart) {
        var extrasStr = ((_a = commentChunk === null || commentChunk === void 0 ? void 0 : commentChunk.slice(typeIndexStart + 1, typeIndexEnd)) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        extras = (_b = extrasStr.split(',')) === null || _b === void 0 ? void 0 : _b.map(function (e) { return e.trim(); });
        commentChunk = commentChunk.slice(typeIndexEnd + 1);
    }
    return {
        extras: extras,
        commentChunk: commentChunk
    };
}
function extractDescription(commentChunk) {
    var _a;
    var description = '';
    // Extract description
    description = ((_a = commentChunk === null || commentChunk === void 0 ? void 0 : commentChunk.slice(0)) === null || _a === void 0 ? void 0 : _a.trim()) || '';
    commentChunk = commentChunk.slice(description.length);
    return {
        description: description,
        commentChunk: commentChunk
    };
}
