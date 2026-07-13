import { defineMdastPlugin } from "satteri";

// Process links
export const mdastLink = defineMdastPlugin({
    name: "link",
    link(node, ctx) {
        if (node.url) {
            const url = node.url
                .trim()
                .replace(/[\s$*_+~.()'"!\-:@]+/g, " ")
                .replace(/\s+/g, "-")
                .toLowerCase();
            console.log(node.url, " => ", url);
            ctx.setProperty(node, "url", url);
        }
    },
});
