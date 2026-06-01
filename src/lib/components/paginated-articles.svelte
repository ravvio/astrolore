<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";

    type Props = {
        articles: CollectionEntry<"articles">[];
        perPage?: number;
        query?: string;
    };
    let { articles, perPage, query }: Props = $props();
</script>

<PaginatedItems
    items={query
        ? articles.filter((a) => {
              const q = query.toLowerCase();
              return (
                  a.data.title.toLowerCase().includes(q) ||
                  (a.data.aliases?.includes(q) ?? false)
              );
          })
        : articles}
    {perPage}
>
    {#snippet child(article: any)}
        <Item.Root variant="outline">
            {#snippet child({ props })}
                <a href={`/${article.id}`} {...props}>
                    <Item.Content>
                        <Item.Title>{article.data.title}</Item.Title>
                    </Item.Content>
                    <Item.Actions>
                        <ChevronRightIcon class="size-4" />
                    </Item.Actions>
                </a>
            {/snippet}
        </Item.Root>
    {/snippet}
</PaginatedItems>
