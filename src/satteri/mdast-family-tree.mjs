import { defineMdastPlugin } from "satteri";

// Generate goto directives
export const mdastFamilyTree = defineMdastPlugin({
    name: "familyTree",
    textDirective(node, ctx) {
        if (node.name === "goto") {
            ctx.report({
                message: "Unexpected `:familyTree` directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "familyTree") return;

        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::familyTree` directive",
                node,
                severity: "error",
            });
            return;
        }

        const data = node.data || (node.data = {});
        data.hName = "familytree";
        data.hProperties = {
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
