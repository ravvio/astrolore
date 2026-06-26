import { defineMdastPlugin } from "satteri";

export const mdastAbstractOf = defineMdastPlugin({
    name: "abstractOf",
    textDirective(node, ctx) {
        if (node.name === "abstractOf") {
            ctx.report({
                message: "Unexpected `:abstractOf` directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "abstractOf") return;

        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::abstractOf` directive",
                node,
                severity: "error",
            });
            return;
        }

        const data = node.data || (node.data = {});
        data.hName = "abstractof";
        data.hProperties = {
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
