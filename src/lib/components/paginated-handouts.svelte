<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
  import type { CollectionEntry } from "astro:content";
  import PaginatedItems from "./paginated-items.svelte";
  import {
    BookOpenIcon,
    BookTextIcon,
    FileTextIcon,
    NewspaperIcon,
    PaperclipIcon,
  } from "@lucide/svelte";

  type Props = {
    handouts: (CollectionEntry<"handouts"> & { url: string })[];
    query?: string;
  };
  let { handouts, query }: Props = $props();
</script>

<PaginatedItems
  items={query ? handouts.filter((h) => {
    let q = query.toLowerCase();
    return (
      h.data.title.toLowerCase().includes(q) ||
      h.data.description?.toLowerCase().includes(q)
    );
  }) : handouts}
>
  {#snippet child(handout: any)}
      <Item.Root variant="outline">
        {#snippet child({ props })}
          <a href={handout.url} target="_blank" {...props}>
            <Item.Media>
              {#if handout.data.kind === "generic"}
                <FileTextIcon class="size-4" />
              {:else if handout.data.kind === "guide"}
                <BookOpenIcon class="size-4" />
              {:else if handout.data.kind === "book"}
                <BookTextIcon class="size-4" />
              {:else if handout.data.kind === "newspaper"}
                <NewspaperIcon class="size-4" />
              {/if}
            </Item.Media>
            <Item.Content>
              <Item.Title>{handout.data.title}</Item.Title>
              {#if handout.data.description}
                <Item.Description>{handout.data.description}</Item.Description>
              {/if}
            </Item.Content>
            <Item.Actions>
              <PaperclipIcon class="size-4" />
            </Item.Actions>
          </a>
        {/snippet}
      </Item.Root>
  {/snippet}
</PaginatedItems>
