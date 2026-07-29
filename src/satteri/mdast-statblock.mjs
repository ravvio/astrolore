import { defineMdastPlugin } from "satteri";

// Satteri plugin that uses directives to embed a statblock
// referenced by slug into a page
export const mdastStatblock = defineMdastPlugin({
    name: "statblock",
    textDirective(node, ctx) {
        if (node.name === "statblock") {
            ctx.report({
                message: "Unexpected `:statblock` text directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "statblock") return;

        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::statblock` directive",
                node,
                severity: "error",
            });
            return;
        }

        const data = node.data || (node.data = {});
        data.hName = "statblock";
        data.hProperties = {
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
