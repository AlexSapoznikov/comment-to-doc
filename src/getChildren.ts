import { DocsJSON, ParsedComment, Tag } from './types';
import { findLast } from './utils';

type TagsMap = {
  [tagName: string]: Tag & {
    parent?: Tag | undefined
  }
};

/**
 * Finds children tags
 */
const findChildTags = (docsJSON: DocsJSON, tags: Tag[]): DocsJSON => {
  return docsJSON.map(docJSON => ({
    ...docJSON,
    data: parseChildren(docJSON.data, tags)
  }));
};

export function parseChildren (tagData: ParsedComment[], tags: Tag[]): ParsedComment[] {
  const tagsMap = createTagsMap(tags);

  return moveChildrenToParents(tagData, tagsMap);
}

function createTagsMap (tags: Tag[], map: Record<string, Tag & { parent?: Tag }> = {}, parent?: Tag): TagsMap {
  tags?.forEach(tag => {
    map[tag.tag] = tag;

    // Attach parent (without children) if exists
    if (parent) {
      const p = { ...parent };
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

function moveChildrenToParents (tagData: ParsedComment[], tagsMap: TagsMap): ParsedComment[] {
  for (let index = tagData.length - 1; index >= 0; index--) {
    const parsedTag = tagData[index];
    const parent = tagsMap?.[parsedTag?.tag]?.parent;

    if (parent) {
      // Move child to children array (will reverse children)
      tagData = moveChild(tagData, index, parsedTag, parent);
    }
  }

  // Reverse children back
  reverseChildrenDeep(tagData);

  return tagData;
}

function moveChild (tagData: ParsedComment[], index: number, child: ParsedComment, parent: Tag) {
  // Find parent
  const findParent = (tagDataPartial: ParsedComment[], child: ParsedComment, parentName: string) => {
    return findLast(tagDataPartial, tag => {
      // Match tag name and alias as well if exists
      const isMatch = tag.tag === parent.tag && (child.alias ? tag.alias === child.alias : true);

      // Recursive
      if (tag.children) {
        return findParent(tag.children, child, parentName) || isMatch;
      }

      return isMatch;
    });
  }

  // // Reverse so we will find last previous parent first
  const foundParent = findParent(tagData.slice(0, index), child, parent.tag);

  // If parent found, move child to its children and remove from current tree level
  if (foundParent) {
    foundParent.children = foundParent.children || [];
    foundParent.children.push(child);
  }

  tagData.splice(index, 1);

  return tagData;
}

function reverseChildrenDeep (tagData: ParsedComment[]): void {
  tagData.forEach(parsedTag => {
    const children = parsedTag?.children;

    if (children?.length) {
      children.reverse();
      reverseChildrenDeep(children);
    }
  });
}

export default findChildTags;
