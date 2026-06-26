import { defineMdastPlugin } from "satteri";

// Satteri plugin that uses directives to specify a timeline to
// add to a page
export const mdastTimeline = defineMdastPlugin({
    name: "timeline",
    textDirective(node, ctx) {
        if (node.name === "timeline") {
            ctx.report({
                message: "Unexpected `:timeline` text directive",
                node,
                severity: "error",
            });
        }
    },
    leafDirective(node, ctx) {
        if (node.name !== "timeline") return;

        const data = node.data || (node.data = {});
        const label = node.label || undefined;
        const attributes = node.attributes || {};
        const id = attributes.id;

        if (!id) {
            ctx.report({
                message: "Missing `id` on `::timeline` directive",
                node,
                severity: "error",
            });
            return;
        }

        data.hName = "timeline";
        data.hProperties = {
            label: label,
            timeline: id,
        };
        ctx.setProperty(node, "data", data);
    },
});
