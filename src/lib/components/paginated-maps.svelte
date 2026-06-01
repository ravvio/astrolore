<script lang="ts">
    import * as Item from "$lib/components/ui/item/index.js";
    import type { CollectionEntry } from "astro:content";
    import PaginatedItems from "./paginated-items.svelte";
    import { ChevronRightIcon } from "@lucide/svelte";

    type Props = {
        maps: CollectionEntry<"maps">[];
        query?: string;
    };
    let { maps, query }: Props = $props();
</script>

<PaginatedItems
    items={query
        ? maps.filter((m) => {
              return (
                  m.data.caption?.toLowerCase().includes(query.toLowerCase()) ??
                  false
              );
          })
        : maps}
>
    {#snippet child(item: any)}
        <Item.Root variant="outline">
            {#snippet child({ props })}
                <a href={`/${item.id}`} {...props}>
                    <Item.Header class="w-full aspect-square">
                        <img
                            src={item.data.image.src}
                            alt={item.data.caption ?? ""}
                            class="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </Item.Header>
                    <Item.Content>
                        {#if item.data.caption}
                            <Item.Description>
                                {item.data.caption}
                            </Item.Description>
                        {/if}
                    </Item.Content>
                    <Item.Actions>
                        <ChevronRightIcon class="size-4" />
                    </Item.Actions>
                </a>
            {/snippet}
        </Item.Root>
    {/snippet}
</PaginatedItems>
