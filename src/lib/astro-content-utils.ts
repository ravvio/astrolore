import {
    getCollection,
    getEntry,
    render,
    type CollectionEntry,
} from "astro:content";
import { slugFromId, projectFromId } from "./content-utils";
import { CustomDate } from "./custom-date";
import type { HistoricKind } from "./schema/codex-article";

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
        const projectId = projectFromId(article.id);
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

export type TimelineEvent = {
    id: string;
    date: CustomDate;
    dateString: string;
    title: string;
    kind: HistoricKind | undefined;
    abstract: string;
};

/**
 * Returns all historic events for a given timeline by extracting them
 * from articles.
 * ```
 * const events = await getTimelineEvents(projectId, "my-timeline");
 * ```
 */
export async function getTimelineEvents(
    projectId: string,
    timeline: string,
): Promise<TimelineEvent[]> {
    const calendar = (await getEntry("projects", projectId))?.data.calendar;

    const entries = await getCollection("articles", (article) => {
        return projectId == projectFromId(article.id);
    });

    const events: TimelineEvent[] = (
        await Promise.all(
            entries.map(async (entry) => {
                if (
                    entry.data.meta?.type !== "historic" ||
                    !entry.data.meta?.timelines?.includes(timeline)
                ) {
                    return null;
                }
                const meta = entry.data.meta;
                if (!meta.date) return null;

                const abstract = await getAbstract(entry);

                if (typeof meta.date === "string") {
                    const date = CustomDate.parse(calendar, meta.date);
                    return {
                        id: entry.id,
                        date,
                        dateString: date.toString(),
                        title: entry.data.title,
                        kind: meta.kind,
                        abstract,
                    };
                } else {
                    const start = CustomDate.parse(calendar, meta.date.start);
                    const end = CustomDate.parse(calendar, meta.date.end);
                    return {
                        id: entry.id,
                        date: start,
                        dateString: `${start.toString()} - ${end.toString()}`,
                        title: entry.data.title,
                        kind: meta.kind,
                        abstract,
                    };
                }
            }),
        )
    ).filter((e) => !!e);
    events.sort((a, b) => a.date.compare(b.date));
    return events;
}
