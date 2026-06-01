import { visit } from "unist-util-visit";

export function remarkMapImage() {
  return function (tree, file) {
    visit(tree, (node) => {
      if (
        (node.type !== "containerDirective" &&
          node.type !== "leafDirective" &&
          node.type !== "textDirective") ||
        node.name !== "map"
      )
        return;

      if (node.type === "textDirective") {
        file.fail("Unexpected `:map` directive", node);
      }

      const data = node.data || (node.data = {});

      const attributes = node.attributes || {};
      const className = attributes.class ?? "";
      const id = attributes.id;

      if (!id) {
        file.fail("Missing `id` on `:map` directive", node);
      }

      file.data.astro.frontmatter.hasMap = true;

      data.hName = "map";
      data.hProperties = {
        class: className,
        slug: id,
      };
    });
  };
}
