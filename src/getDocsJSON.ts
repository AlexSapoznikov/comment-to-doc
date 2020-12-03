import { flattenArr } from './utils';
import { DocsJSON, ExtractedTagData, FileContent, ParsedComment } from './types';

export const getDocsJSON = (fileContents: FileContent[]): DocsJSON => {
  return fileContents.map(fileContent => ({
    path: fileContent.path,
    data: parser(fileContent.content)
  }));
};

// Comment parser
export function parser(content: string): ParsedComment[] {
  return parseComments(
    parseContent(content)
  );
}

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
    const commentLines = comment.split('\n');
    const contentSpacing = getSpacingAfterFirstCommentWithAsterisk(commentLines);

    const parsedCommentLines = commentLines
      .map((commentLine, index) => {
        const isTagComment = index === 0;

        // Remove symbols
        commentLine = commentRemoveSymbols(commentLine)

        // If first line, the it is a tag
        if (isTagComment) {
          return extractTagData(commentLine)
        }

        // Return comment line (trim by needed contentSpacing in order to keep indentation)
        return commentLine.slice(contentSpacing || 0);
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
 * Get contents first line space between asterisk and text
 * @param comments
 */
function getSpacingAfterFirstCommentWithAsterisk (comments: string[]) {
  const firstCommentWithAsterisk = comments.find(line => line?.trim()?.startsWith('*'));
  const trimmedFirstCommentWithAsterisk = firstCommentWithAsterisk?.trim();

  if (trimmedFirstCommentWithAsterisk) {
    const spacing = trimmedFirstCommentWithAsterisk
      ?.slice(1)
      ?.match(/^(\W+)/)
      ?.[0]
      ?.length;

    // /* content - exclude that one possible space between asterisk and content
    return spacing || 0;
  }

  return 0;
}

/**
 * Remove symbols
 * @param comment
 */
function commentRemoveSymbols (comment: string) {
  const removeSymbols = ['*', '@'];
  const trimmedContent = comment?.trim();

  return removeSymbols.some(symbol => trimmedContent.startsWith(symbol))
    ? trimmedContent.slice(1)
    : comment;
}

/**
 * Extract tag, type, description
 * @param tagComment
 */
function extractTagData (tagComment: string) {
  let tag = tagComment;
  let alias = '';
  let type = '';
  let required = false;
  let description = '';
  let extras = [];

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
  required = extractedType.required;
  commentChunk = extractedType.commentChunk;

  // Extract extras
  const extractedExtras = extractExtras(commentChunk);
  extras = extractedExtras.extras;
  commentChunk = extractedExtras.commentChunk;

  // Extract description
  const extractedDescription = extractDescription(commentChunk);
  description = extractedDescription.description;
  commentChunk = extractedDescription.commentChunk;

  // Return extracted data
  return {
    tag,
    alias,
    type,
    required,
    extras,
    description
  };
}

function extractTag (commentChunk: string) {
  let tagEndIndex = commentChunk.indexOf(' ');
  tagEndIndex = tagEndIndex < 0 ? commentChunk.length : tagEndIndex;

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
  let required = false;

  const typeIndexStart = commentChunk.indexOf('{');
  const typeIndexEnd = commentChunk.indexOf('}');

  // Extract type
  if (typeIndexStart >= 0 && typeIndexEnd > typeIndexStart) {
    type = commentChunk?.slice(typeIndexStart + 1, typeIndexEnd)?.trim() || '';
    commentChunk = commentChunk.slice(typeIndexEnd + 1);
  }

  if (type.endsWith('!')) {
    required = true;
    type = type?.slice(0, type.length - 1).trim();
  }

  return {
    type,
    required,
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
