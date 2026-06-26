import { defineMdastPlugin } from "satteri";

export const mdastDate = defineMdastPlugin({
    name: "date",
    textDirective(node, ctx) {
        if (
            (node.type !== "containerDirective" &&
                node.type !== "leafDirective" &&
                node.type !== "textDirective") ||
            node.name !== "date"
        )
            return;

        if (!node.children[0] || typeof node.children[0].value !== "string") {
            ctx.report({
                message: "Missing or wrong children for `:date` directive",
                node,
                severity: "error",
            });
            return;
        }

        const dateString = node.children[0].value;

        const data = node.data || (node.data = {});
        data.hName = "date";
        data.hProperties = {
            value: dateString,
        };
        ctx.setProperty(node, "data", data);
    },
    leafDirective(node, ctx) {
        if (node.name === "date") {
            ctx.report({
                message: "Unexpected `::date` leaf directive",
                node,
                severity: "error",
            });
            return;
        }
    },
});
