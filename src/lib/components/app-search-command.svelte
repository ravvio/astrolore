<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  import type { CollectionEntry } from "astro:content";
  import { navigate } from "astro:transitions/client";
  import { slugFromId } from "$lib/content-utils";

  type Props = {
    project: CollectionEntry<"projects">;
    categories: CollectionEntry<"categories">[];
    articles: CollectionEntry<"articles">[];
    documents: CollectionEntry<"documents">[];
  };
  const { categories, articles, documents }: Props = $props();

</script>

