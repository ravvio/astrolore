import { defineMdastPlugin } from "satteri";

// Satteri plugin that uses directives to specify a table to
// add to a page
export const mdastRngTable = defineMdastPlugin({
    name: "rngTable",
    textDirective(node, ctx) {
        if (node.name === "table") {
            ctx.report({
                message: "Unexpected `:table` text directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "table") return;

        const label = node.label || undefined;
        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::table` directive",
                node,
                severity: "error",
            });
            return;
        }

        const data = node.data || (node.data = {});
        data.hName = "rngtable";
        data.hProperties = {
            label: label,
            table: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
