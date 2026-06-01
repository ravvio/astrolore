import { visit } from "unist-util-visit";

export function remarkDate() {
    return function (tree, file) {
        visit(tree, (node) => {
            if (
                (node.type !== "containerDirective" &&
                    node.type !== "leafDirective" &&
                    node.type !== "textDirective") ||
                node.name !== "date"
            )
                return;

            if (node.type !== "textDirective") {
                file.fail("Unexpected `::date` directive", node);
            }
            if (
                !node.children[0] ||
                typeof node.children[0].value !== "string"
            ) {
                file.fail("Missing or wrong children for `::date` directive");
            }

            const data = node.data || (node.data = {});
            const dateString = node.children[0].value;

            data.hName = "date";
            data.hProperties = {
                value: dateString,
            };
        });
    };
}
