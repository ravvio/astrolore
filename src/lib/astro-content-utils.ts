import { getCollection, render, type CollectionEntry } from "astro:content";
import { slugFromId, projectFromId } from "./content-utils";

/**
 * Builds a lookup map keyed by `"{projectId}/{slug}"` and `"{projectId}/{alias}"`.
 * ```
 * const map = buildArticleMap(articles);
 * const article = map.get('test/example');
 * ```
 */
export function buildArticleMap(
  articles: CollectionEntry<"articles">[],
): Map<string, CollectionEntry<"articles">> {
  const map = new Map<string, CollectionEntry<"articles">>();
  for (const article of articles) {
    const projectId = projectFromId(article.id)
    map.set(`${projectId}/${slugFromId(article.id)}`, article);
    for (const alias of article.data.aliases ?? []) {
      map.set(`${projectId}/${alias}`, article);
    }
  }
  return map;
}

/**
 * Finds an article by project and slug, resolving aliases.
 * Prefer `buildArticleMap` when resolving multiple references at once.
 * ```
 * const article = await getArticleFromSlug('test', 'example');
 * ```
 */
export async function getArticleFromSlug(projectId: string, slug: string) {
  const articles = await getCollection("articles", (article) => {
    const articleProjectId = projectFromId(article.id);
    const articleSlug = slugFromId(article.id);

    return (
      articleProjectId === projectId &&
      (articleSlug === slug ||
        (article.data.aliases && article.data.aliases.includes(slug)))
    );
  });

  if (articles.length == 0) {
    return;
  }

  if (articles.length > 1) {
    console.error(
      `Duplicate result for slug ${slug}, probably caused by aliases.`,
    );
  }

  return articles[0];
}

/**
 * Returns the auto-extracted abstract for an article (first paragraph),
 * falling back to the raw body if the remark plugin data is unavailable.
 * ```
 * const abstract = await getAbstract(article);
 * ```
 */
export async function getAbstract(
  article: CollectionEntry<"articles"> | undefined,
) {
  try {
    if (!article) return undefined;
    const renderData = await render(article);
    return renderData.remarkPluginFrontmatter.abstract ?? article.body;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
