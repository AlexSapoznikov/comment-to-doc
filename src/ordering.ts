import { Config, DocsJSON } from "./types";

export default function applyOrdering (docsJSON: DocsJSON, config: Config): DocsJSON {
  const tagsOrder = config.tagsOrder;
  const tagsOrderInFiles = config.tagsOrderInFiles;

  // General re-order if needed
  if (tagsOrder?.length || tagsOrderInFiles?.length) {
    const orderFiles = Object.keys(tagsOrderInFiles || {});

    docsJSON.forEach(doc => {
      const orderFile = orderFiles?.find(orderFile => doc.path?.includes(orderFile));

      // Get specific order or general order
      let orderConfig = tagsOrderInFiles?.[orderFile] || tagsOrder;
      orderConfig = [...(orderConfig || [])]
        ?.map(t => t?.toLowerCase()?.trim())
        ?.reverse();

      if (orderConfig) {
        doc.data = doc.data.sort((a, b) =>
          orderConfig.indexOf(b?.tag?.toLowerCase()?.trim()) - orderConfig.indexOf(a?.tag?.toLowerCase()?.trim()))
      }
    });
  }

  return docsJSON;
}
