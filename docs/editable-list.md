# EditableList, EditableListRow, ReorderActions and ReorderAnnouncement

These primitives are available only from `giadaware-ui-components/studio`.

```svelte
<script lang="ts">
	import {
		EditableList,
		EditableListRow,
		ReorderActions,
		ReorderAnnouncement
	} from 'giadaware-ui-components/studio';

	let images = $state([{ id: 'hero', title: 'Hero' }]);
	let reorderEventKey = $state<number | null>(null);
	let reorderAnnouncement = $state<string | null>(null);
	let nextReorderEvent = 0;

	function confirmMove(index: number, direction: -1 | 1) {
		/* consumer mutation, persistence and success/failure policy */
		reorderAnnouncement = 'Resolved localized reorder message';
		reorderEventKey = ++nextReorderEvent;
	}
</script>

{#snippet empty()}No images yet.{/snippet}

<EditableList legend="Gallery" isEmpty={images.length === 0} {empty}>
	{#each images as image, index (image.id)}
		{#snippet fields()}{image.title}{/snippet}
		{#snippet actions()}
			<ReorderActions
				moveUpLabel="Move image up"
				moveDownLabel="Move image down"
				canMoveUp={index > 0}
				canMoveDown={index < images.length - 1}
				onMoveUp={() => confirmMove(index, -1)}
				onMoveDown={() => confirmMove(index, 1)}
			/>
		{/snippet}
		<EditableListRow position={index + 1} {fields} {actions} />
	{/each}
</EditableList>

<ReorderAnnouncement
	message={reorderAnnouncement}
	eventKey={reorderEventKey}
/>
```

`EditableList` owns a native `fieldset` and string `legend`, optional description and empty snippets, an ordered-list region, and an optional add-action region. `isEmpty` is a consumer-owned cardinality signal: `true` selects the `empty` snippet and suppresses the list; `false` selects the list when `children` is present. When omitted, children select rows mode and their absence selects empty mode. This preserves composition for static content but cannot determine whether a consumer `{#each}` has rows.

`EditableListRow` is a direct `li` with a visible one-based position, fields, then actions. Invalid runtime positions (non-finite, non-integer, or less than one) deterministically render as `1`. The visible number is hidden from assistive technology so the native list ordinal is not announced twice.

`ReorderActions` renders move up then move down as native `type="button"` controls. Its exact labels come from `moveUpLabel` and `moveDownLabel`; callbacks receive no arguments. `canMoveUp` and `canMoveDown` default to `true` and alone determine disabled state. Unknown untyped `size` values normalize to `default`, consistent with `Button`; supported values are `default` and `compact`.

`ReorderAnnouncement` is the Studio-only companion primitive for confirmed reorder outcomes. It renders one visually hidden polite `role="status"` live-region shell and no visible text. Consumers own item identity, item arrays, reorder intent handling, mutation success or failure, position calculation, localization, the final announcement message, and the event key. `ReorderActions` only represents intent and never announces.

`eventKey` is the announcement event boundary. Message equality is irrelevant: changing the message while keeping the same `eventKey` is not a new announcement, while changing `eventKey` can announce the same message again. Use a consumer-owned monotonically increasing counter, confirmed mutation ID, or other existing stable event ID. Do not use `Date.now()` as the canonical event key. Use `null` when there is no confirmed reorder event, and pass `null` or blank `message` to fail closed without meaningful announcement text.

The lifecycle should be confirmed-state-only: intent, consumer mutation, confirmed state update, then `message` and `eventKey` update. Disabled controls or failed mutations should not update `eventKey`. Server rendering and initial hydration keep the live-region shell empty even if initial props contain a previous result, so stale preexisting state is not announced. The first announcement can occur only after a post-hydration `eventKey` change. Repeated identical messages with distinct event keys are cleared and reinserted across a Svelte tick boundary so assistive technology can receive each confirmed event.

`FormStatus` remains visible general operation feedback. `ReorderAnnouncement` is a visually hidden, event-driven companion specifically for confirmed `EditableList` reorder outcomes and does not compose or reuse `FormStatus`. Do not mirror the same reorder outcome into another live region, including `FormStatus` or `StatusNotice`, because that can produce duplicate announcements. If visible confirmation is needed, compose separate non-live text beside `ReorderAnnouncement`.

Consumers own arrays, schemas, keyed `{#each}` rendering and logical identity, add/remove/reorder mutations, cardinality, field names and IDs, `FormData`, validation, persistence, focus after mutation, and dirty tracking. Gallery and Meta therefore pass their own explicit empty condition, for example `isEmpty={images.length === 0}`. The Gallery minimum-one policy and Meta zero-row policy remain consumer-owned. Remove actions compose with the existing `Button`. Relations, drag and drop, combobox behavior, positional context beyond the consumer-resolved message, and any monolithic `DynamicFieldList` are explicitly excluded. Issue #36 remains the separate place for any additional positional-context work.

The public style hooks are isolated to `--giu-editable-list-*`, `--giu-editable-list-row-*`, `--giu-reorder-actions-*`, and `--giu-reorder-announcement-*`. Common hooks include `--giu-editable-list-row-gap`, `--giu-editable-list-row-padding`, `--giu-editable-list-row-border`, `--giu-reorder-actions-gap`, `--giu-reorder-actions-control-size`, `--giu-reorder-announcement-size`, and `--giu-reorder-announcement-margin`.
