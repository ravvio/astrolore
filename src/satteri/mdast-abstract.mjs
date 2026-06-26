/**
 * Remark plugin to generate an abstract of markdown files from the first
 * paragraph
 */

import { defineMdastPlugin } from "satteri";

function flatten(children) {
    var text = [];

    if (children) {
        for (var child of children) {
            if (child.value) {
                text.push(child.value);
            } else if (child.children) {
                text = text.concat(flatten(child.children));
            }
        }
    }

    return text;
}

export const mdastAbstract = defineMdastPlugin({
    name: "abstract",
    paragraph(node, ctx) {
        // If we already have an abstract we are done
        if (ctx.data.astro.frontmatter["abstract"]) return;

        var text = flatten(node.children);
        ctx.data.astro.frontmatter["abstract"] = text
            .join("")
            .replaceAll("\n", " ")
            .trim();
    },
});
