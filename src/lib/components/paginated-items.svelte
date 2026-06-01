<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from "svelte";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import { flip } from "svelte/animate";

  type Props = {
    items: T[];
    child: Snippet<[T]>;
    perPage?: number;
  };
  let { items, child, perPage = 10 }: Props = $props();
</script>

<Pagination.Root
  count={items.length}
  {perPage}
  class="w-full flex flex-col space-y-8 items-center"
>
  {#snippet children({ pages, currentPage, range })}
    <div class="grid lg:grid-cols-2 w-full gap-4">
      {#each items.slice(range.start - 1, range.end) as item (item.id)}
        <div animate:flip={{ duration: 500 }}>
          {@render child(item)}
        </div>
      {/each}
    </div>

    {#if items.length > perPage}
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous />
        </Pagination.Item>
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link {page} isActive={currentPage === page.value}>
                {page.value}
              </Pagination.Link>
            </Pagination.Item>
          {/if}
        {/each}
        <Pagination.Item>
          <Pagination.Next />
        </Pagination.Item>
      </Pagination.Content>
    {/if}
  {/snippet}
</Pagination.Root>
