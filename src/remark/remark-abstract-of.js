import { visit } from "unist-util-visit";

export function remarkAbstractOf() {
  return function (tree, file) {
    visit(tree, (node) => {
      if (
        (node.type !== "containerDirective" &&
          node.type !== "leafDirective" &&
          node.type !== "textDirective") ||
        node.name !== "abstractOf"
      )
        return;

      if (node.type === "textDirective") {
        file.fail("Unexpected `:abstractOf` directive", node);
      }

      const data = node.data || (node.data = {});
      const attributes = node.attributes || {};
      const id = attributes.id;

      if (!id) {
        file.fail("Missing `id` on `:abstractOf` directive", node);
      }

      data.hName = "abstractof";
      data.hProperties = {
        slug: id,
      };
    });
  };
}
