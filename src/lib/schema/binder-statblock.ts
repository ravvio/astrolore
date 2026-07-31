import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";
import { StatblockDND5eData } from "./statblocks/dnd5e";
import { ImageOrUrl } from "./common";

export const StatblockData = (image: ImageFunction) =>
    z.object({
        name: z.string(),
        description: z.string().optional(),
        image: ImageOrUrl(image).optional(),
        systems: z.object({
            dnd5e: StatblockDND5eData.optional(),
        }),
    });
export type StatblockData = z.infer<ReturnType<typeof StatblockData>>;
