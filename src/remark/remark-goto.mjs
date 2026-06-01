import { visit } from "unist-util-visit";

// Generate goto directives
export function remarkGoto() {
  return function (tree, file) {
    visit(tree, (node) => {
      if (
        (node.type !== "containerDirective" &&
          node.type !== "leafDirective" &&
          node.type !== "textDirective") ||
        node.name !== "goto"
      )
        return;

      if (node.type === "textDirective") {
        file.fail("Unexpected `:goto` directive", node);
      }

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      const id = attributes.id;

      if (!id) {
        file.fail("Missing `id` on `:goto` directive", node);
      }

      data.hName = "goto";
      data.hProperties = {
        slug: id,
      };
    });
  };
}
