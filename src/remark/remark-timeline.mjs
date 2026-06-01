import { visit } from "unist-util-visit";

// Remark plugin that uses directives to specify a timeline to
// add to a page
export function remarkTimeline() {
    return function (tree, file) {
        visit(tree, (node) => {
            if (
                (node.type !== "containerDirective" &&
                    node.type !== "leafDirective" &&
                    node.type !== "textDirective") ||
                node.name !== "timeline"
            )
                return;

            if (node.type === "textDirective") {
                file.fail("Unexpected `:timeline` directive", node);
            }

            const data = node.data || (node.data = {});
            const label = node.label || undefined;
            const attributes = node.attributes || {};
            const id = attributes.id;

            if (!id) {
                file.fail("Missing `id` on `:timeline` directive", node);
            }

            data.hName = "timeline";
            data.hProperties = {
                label: label,
                timeline: id,
            };
        });
    };
}
