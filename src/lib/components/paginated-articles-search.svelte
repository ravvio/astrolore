<script lang="ts">
    import type { CollectionEntry } from "astro:content";
    import PaginatedArticles from "./paginated-articles.svelte";
    import PaginationSearch from "./pagination-search.svelte";

    type Props = {
        placeholder: string;
        articles: CollectionEntry<"articles">[];
        perPage?: number;
    };

    let { placeholder, articles, perPage }: Props = $props();
    let query = $state("");
</script>

<PaginationSearch bind:query={query} {placeholder} />
<PaginatedArticles {articles} query={query} {perPage} />
