import { defineMdastPlugin } from "satteri";

// Generate goto directives
export const mdastGoto = defineMdastPlugin({
    name: "goto",
    textDirective(node, ctx) {
        if (node.name === "goto") {
            ctx.report({
                message: "Unexpected `:goto` directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "goto") return;

        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::goto` directive",
                node,
                severity: "error",
            });
            return;
        }

        const data = node.data || (node.data = {});
        data.hName = "goto";
        data.hProperties = {
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
