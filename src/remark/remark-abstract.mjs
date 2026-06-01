/**
 * Remark plugin to generate an abstract of markdown files from the first
 * paragraph
 */

import { visit } from "unist-util-visit";

function flatten(children) {
  var text = [];

  if (children) {
    for (var child of children) {
      if (child.value) {
        text.push(child.value);
      } else if (child.children) {
        text = text.concat(flatten(child.children));
      }
    }
  }

  return text;
}

export function remarkAbstract() {
  return function (tree, file) {
    visit(tree, (node) => {
      // If we already have an abstract we are done
      if (file.data.astro.frontmatter["abstract"]) return;
      if (node.type !== "paragraph") return;

      var text = flatten(node.children);
      file.data.astro.frontmatter["abstract"] = text
        .join("")
        .replaceAll("\n", " ")
        .trim();
    });
  };
}
