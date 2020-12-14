/**
 * Group all docsJSON entries by output
 */
import { Config, DocsJSON } from "./types";
import { getOutput } from "./utils";

export default function group (docsJSON: DocsJSON, config: Config): DocsJSON {
  const groupedDocsJSON: DocsJSON = [];

  docsJSON.forEach(doc => {
    doc.output = getOutput(doc, config);

    const groupedDoc = groupedDocsJSON.find(gdoc => gdoc.output === doc.output);

    if (groupedDoc) {
      groupedDoc.data.push(...(doc.data || []));
    } else {
      groupedDocsJSON.push(doc);
    }
  });

  return groupedDocsJSON;
}
