import { parseComments, parseContent } from "../../src/getDocsJSON";

export const testParser = (comment: string) => {
  return parseComments(
    parseContent(comment.trim())
  );
};
