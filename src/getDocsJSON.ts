import { flattenArr } from './utils';
import { DocsJSON, ExtractedTagData, FileContent, ParsedComment } from './types';

export const getDocsJSON = (fileContents: FileContent[]): DocsJSON => {
  return fileContents.map(fileContent => ({
    path: fileContent.path,
    data: parseComments(
      parseContent(fileContent.content)
    )
  }));
};

function parseContent (content: string) {
  let currentContentPart = content;
  let tagIndex = 0;

  const comments = [];

  while (tagIndex >= 0) {
    // Find comment start and end index
    tagIndex = currentContentPart.indexOf('/*');

    // If no more indexes found, stop loop
    if (tagIndex < 0) {
      break;
    }

    // Get comment
    const commentStart = currentContentPart.slice(tagIndex);
    let endIndex = commentStart.indexOf('*/');
    endIndex = endIndex < 0 ? 0 : endIndex;
    const comment = commentStart?.slice(commentStart.indexOf('@'), endIndex)?.trim();

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
function parseComments (fileComments: string[]): ParsedComment[] {
  // Handle multiple tags inside single comment
  fileComments = handleMultiTagsInSingeComment(fileComments);

  return fileComments.map(comment => {
    const parsedCommentLines = comment
      .split('\n')
      .map((commentLine, index) => {
        const isTagComment = index === 0;

        // Trim it
        commentLine = commentLine.trim();

        // Remove symbols
        commentLine = commentRemoveSymbols(commentLine)

        // If first line, the it is a tag
        if (isTagComment) {
          return extractTagData(commentLine)
        }

        // Return comment line
        return commentLine;
      })
      .filter(exists => exists);

    // Tag data
    const tagData = parsedCommentLines.splice(0, 1)?.[0] as ExtractedTagData;

    // Under tag comment
    const underTagComment = parsedCommentLines.join('\n');

    return {
      ...tagData, // extracted tag/type/description
      content: underTagComment
    };
  });
}

/**
 * Handle multi tags in same comment
 * @param fileComments
 */
function handleMultiTagsInSingeComment (fileComments: string[]) {
  const separatedComments = fileComments
    .map(comment => comment.split('@'));

  // Flatten array and remove empty comments
  return flattenArr(separatedComments)
    .filter(exists => !!exists.trim());
}

/**
 * Remove symbols
 * @param comment
 */
function commentRemoveSymbols (comment: string) {
  const removeSymbols = ['*', '@'];

  const modifiedComment = removeSymbols.some(symbol => comment.startsWith(symbol))
    ? comment.slice(1)
    : comment;

  return modifiedComment?.trim();
}

/**
 * Extract tag, type, description
 * @param tagComment
 */
function extractTagData (tagComment: string) {
  const spaceExists = string => string.indexOf(' ') >= 0;
  let tag = tagComment;
  let alias = '';
  let type = '';
  let description = '';
  let extras = [];

  // If no type or description exist
  if (spaceExists(tagComment)) {
    // Comment chunk that lefts after each extract
    let commentChunk = tagComment;

    // Extract tag
    const extractedTag = extractTag(commentChunk);
    tag = extractedTag.tag;
    alias = extractedTag.alias;
    commentChunk = extractedTag.commentChunk;

    // Extract type
    const extractedType = extractType(commentChunk);
    type = extractedType.type;
    commentChunk = extractedType.commentChunk;

    // Extract extras
    const extractedExtras = extractExtras(commentChunk);
    extras = extractedExtras.extras;
    commentChunk = extractedExtras.commentChunk;

    // Extract description
    const extractedDescription = extractDescription(commentChunk);
    description = extractedDescription.description;
    commentChunk = extractedDescription.commentChunk;
  }

  // Return extracted data
  return {
    tag,
    alias,
    type,
    extras,
    description
  };
}

function extractTag (commentChunk: string) {
  const tagEndIndex = commentChunk.indexOf(' ');
  const [tag, alias] = commentChunk.slice(0, tagEndIndex)?.split(':');
  commentChunk = commentChunk.slice(tagEndIndex);

  return {
    tag,
    alias: alias || '',
    commentChunk
  }
}

function extractType (commentChunk: string) {
  let type = '';

  const typeIndexStart = commentChunk.indexOf('{');
  const typeIndexEnd = commentChunk.indexOf('}');

  // Extract type
  if (typeIndexStart >= 0 && typeIndexEnd > typeIndexStart) {
    type = commentChunk?.slice(typeIndexStart + 1, typeIndexEnd)?.trim() || '';
    commentChunk = commentChunk.slice(typeIndexEnd + 1);
  }

  return {
    type,
    commentChunk
  }
}

function extractExtras (commentChunk: string) {
  let extras = [];

  const typeIndexStart = commentChunk.indexOf('[');
  const typeIndexEnd = commentChunk.indexOf(']');

  // Extract type
  if (typeIndexStart >= 0 && typeIndexEnd > typeIndexStart) {
    const extrasStr = commentChunk?.slice(typeIndexStart + 1, typeIndexEnd)?.trim() || '';
    extras = extrasStr.split(',')?.map(e => e.trim());
    commentChunk = commentChunk.slice(typeIndexEnd + 1);
  }

  return {
    extras,
    commentChunk
  }
}

function extractDescription (commentChunk: string) {
  let description = '';

  // Extract description
  description = commentChunk?.slice(0)?.trim() || '';
  commentChunk = commentChunk.slice(description.length);

  return {
    description,
    commentChunk
  }
}
