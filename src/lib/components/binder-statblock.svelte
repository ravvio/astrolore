<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import StatblockDND5e from "./statblock-dnd5e.svelte";
    import type { StatblockData } from "$lib/schema/binder-statblock";
    import type { Translations } from "$lib/i18n";
    import { getImageSrc } from "$lib/content-utils";

    type StatblockSystem = keyof StatblockData["systems"];

    type Props = {
        data: StatblockData;
        translations: Translations;
        showImage?: boolean;
    };
    const { data, translations: t, showImage }: Props = $props();

    const imgSrc = $derived(data.image ? getImageSrc(data.image) : undefined);

    let selected = $state<StatblockSystem>();
    const availableSystems = $derived(
        Object.keys(data.systems),
    ) as StatblockSystem[];

    $effect(() => {
        if (!selected && availableSystems.length) {
            selected = availableSystems[0];
        }
    });
</script>

<Card.Root class="text-sm">
    {#if imgSrc && showImage}
        <img
            src={imgSrc}
            alt={data.name}
            class="relative z-20 aspect-video object-center w-full object-cover"
        />
    {/if}

    <Card.Header>
        <Card.Title class="">{data.name}</Card.Title>
        {#if data.description}
            <Card.Description>{data.description}</Card.Description>
        {/if}

        {#if availableSystems.length > 0}
            <Card.Action>
                <Select.Root
                    type="single"
                    value={selected}
                    onValueChange={(value) =>
                        (selected = value as StatblockSystem)}
                >
                    <Select.Trigger class="w-40">
                        {selected
                            ? t.statblock.systems[selected]
                            : t.statblock.selectSystem}
                    </Select.Trigger>
                    <Select.Content>
                        {#each availableSystems as system}
                            <Select.Item
                                value={system}
                                label={t.statblock.systems[system]}
                            />
                        {/each}
                    </Select.Content>
                </Select.Root>
            </Card.Action>
        {/if}
    </Card.Header>

    <Card.Content class="text-sm">
        {#if selected === "dnd5e" && data.systems.dnd5e}
            <StatblockDND5e
                {data}
                stats={data.systems.dnd5e}
                translations={t.statblock.dnd5e}
            />
        {/if}
    </Card.Content>
</Card.Root>
