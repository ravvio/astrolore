import { visit } from "unist-util-visit";

// Remark plugin that uses directives to specify a table to
// add to a page
export function remarkTable() {
    return function (tree, file) {
        visit(tree, (node) => {
            if (
                (node.type !== "containerDirective" &&
                    node.type !== "leafDirective" &&
                    node.type !== "textDirective") ||
                node.name !== "table"
            )
                return;

            if (node.type === "textDirective") {
                file.fail("Unexpected `:table` directive", node);
            }

            const data = node.data || (node.data = {});
            const label = node.label || undefined;
            const attributes = node.attributes || {};
            const id = attributes.id;

            if (!id) {
                file.fail("Missing `id` on `:table` directive", node);
            }

            data.hName = "rngtable";
            data.hProperties = {
                label: label,
                table: id,
            };
        });
    };
}
