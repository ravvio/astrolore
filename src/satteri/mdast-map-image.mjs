import { defineMdastPlugin } from "satteri";

export const mdastMapImage = defineMdastPlugin({
    name: "mapImage",
    textDirective(node, ctx) {
        if (node.name === "map") {
            ctx.report({
                message: "Unexpected `:map` directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "map") return;

        const attributes = node.attributes || {};
        const className = attributes.class ?? "";
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::map` directive",
                node,
                severity: "error",
            });
            return;
        }

        ctx.data.astro.frontmatter.hasMap = true;

        const data = node.data || (node.data = {});
        data.hName = "map";
        data.hProperties = {
            class: className,
            slug: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
