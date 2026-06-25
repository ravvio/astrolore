<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "./ui/badge";
    import type { TableData, TableItem } from "$lib/schema/binder-table";
    import { DicesIcon } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";

    type Props = {
        table: TableData;
        class?: string;
    };
    const { table, class: className }: Props = $props();
    const { title, caption, tags, items } = $derived(table);

    type Row = {
        label: string,
        value: string,
        start: number,
        end: number,
    }
    function buildRows(items: TableItem[]) {
        const rows: Row[] = [];
        let start = 1;
        for (let i = 0; i < items.length; i++) {
            const end = start + items[i].weight - 1;

            rows.push({
                label: start == end ? `${start}` : `${start}-${end}`,
                value: items[i].value,
                start: start,
                end: end,
            });

            start = end + 1;
        }
        return rows;
    }

    const total = $derived(
        items.reduce((prev, curr) => (prev += curr.weight), 0),
    );
    let rows = $derived(buildRows(items));


    let selected: number | null = $state(null);
    function roll() {
        selected = 1 + Math.floor(Math.random() * total);
    }
    function isSelected(row: Row) {
        return selected && selected >= row.start && selected <= row.end;
    }
</script>

<Card.Root class={className}>
    <Card.Header>
        <Card.Title>
            {title}
        </Card.Title>
        <Card.Action>
            <Button variant="ghost" size="default" onclick={roll}>
                <DicesIcon />
                {selected}
            </Button>
        </Card.Action>
        <div class="flex flex-row flew-wrap gap-2">
            {#each tags as tag}
                <Badge>{tag}</Badge>
            {/each}
        </div>
    </Card.Header>
    <Card.Content>
        <Table.Root>
            <Table.Caption>
                {caption}
            </Table.Caption>
            <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[50px] text-end">d{total}</Table.Head>
                    <Table.Head>Value</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each rows as row}
                    <Table.Row data-selected={isSelected(row)} class="data-[selected=true]:bg-muted/80 transition-colors duration-300">
                        <Table.Cell class="font-medium text-end"
                            >{row.label}</Table.Cell
                        >
                        <Table.Cell>{row.value}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Content>
</Card.Root>
