<script lang="ts">
    import {
        EditableList, EditableListRow, ReorderActions, ReorderAnnouncement,
        Checkbox, Button, Surface
    } from 'giadaware-ui-components';

    type Item = { id: string; title: string; done: boolean };
    const initial = (): Item[] => [
        { id: 'labels', title: 'Check native labels', done: true },
        { id: 'keyboard', title: 'Try keyboard interactions', done: false },
        { id: 'hydration', title: 'Review hydration behavior', done: false },
        { id: 'package', title: 'Verify packed consumption', done: false }
    ];

    let items = $state<Item[]>(initial());
    let message = $state<string | null>(null);
    let eventKey = $state<number | null>(null);
    let nextEvent = 0;

    function move(id: string, direction: -1 | 1) {
        const from = items.findIndex((item) => item.id === id);
        const to = from + direction;
        if (from < 0 || to < 0 || to >= items.length) return;
        const reordered = [...items];
        const [item] = reordered.splice(from, 1);
        reordered.splice(to, 0, item);
        // Accept the collection mutation before confirming an announcement.
        items = reordered;
        message = `${item.title} moved to position ${to + 1} of ${items.length}.`;
        eventKey = ++nextEvent;
    }

    function reset() {
        items = initial();
        message = null;
        eventKey = null;
        // Keep the event counter monotonic across resets.
    }
</script>

<p>Move controls reorder the consumer-owned keyed array. This version has no pointer drag handles.</p>

<EditableList legend="Review checklist" isEmpty={items.length === 0}>
    {#each items as item, index (item.id)}
        {#snippet fields()}
            <div class="demo-choice">
                <Checkbox id={`checklist-${item.id}`} bind:checked={item.done} />
                <label for={`checklist-${item.id}`}>{item.title}</label>
            </div>
        {/snippet}
        {#snippet actions()}
            <ReorderActions
                moveUpLabel={`Move ${item.title} up`}
                moveDownLabel={`Move ${item.title} down`}
                canMoveUp={index > 0}
                canMoveDown={index < items.length - 1}
                positionContext={{
                    id: `checklist-${item.id}-position`,
                    text: `${item.title}, position ${index + 1} of ${items.length}`
                }}
                onMoveUp={() => move(item.id, -1)}
                onMoveDown={() => move(item.id, 1)}
            />
        {/snippet}
        <EditableListRow position={index + 1} {fields} {actions} />
    {/each}
</EditableList>

<ReorderAnnouncement {message} {eventKey} />
<Button variant="secondary" onclick={reset}>Reset checklist</Button>

<Surface class="demo-state">
    <p>Last confirmed move: {message ?? 'None.'}</p>
    <pre>{JSON.stringify({ items, eventKey }, null, 2)}</pre>
</Surface>

<p class="demo-docs">
    Contract:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/editable-list.md">EditableList family and confirmed reorder announcements</a>.
</p>
