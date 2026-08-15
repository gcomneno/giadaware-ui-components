[English](editable-list.md) | [Italiano](it/editable-list.md)

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
	import type { ReorderActionsPositionContext } from 'giadaware-ui-components/studio';

	let images = $state([{ id: 'hero', title: 'Hero' }]);
	let reorderEventKey = $state<number | null>(null);
	let reorderAnnouncement = $state<string | null>(null);
	let nextReorderEvent = 0;

	function positionContextFor(
		image: { id: string; title: string },
		index: number,
		total: number
	): ReorderActionsPositionContext {
		return {
			id: `gallery-${image.id}-reorder-context`,
			text: `${image.title}, position ${index + 1} of ${total}`
		};
	}

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
				positionContext={positionContextFor(image, index, images.length)}
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

`EditableListRow` can also render an optional row-local pointer drag handle as a progressive enhancement:

```ts
export type EditableListRowDropPosition = 'before' | 'after';

export type EditableListRowDragCandidate = {
	sourceId: string;
	targetId: string;
	position: EditableListRowDropPosition;
};

export type EditableListRowDragCancelReason =
	| 'pointercancel'
	| 'lostpointercapture'
	| 'escape';
```

Pass `drag` only when pointer reordering is useful. A valid config needs a stable row `id`, an exact handle `label`, and `onDrop`. Invalid runtime configs fail closed without rendering a handle. The handle is an explicit native `type="button"` control marked with `data-giu-drag-handle`; the row itself is never `draggable`, never receives deprecated drag-and-drop ARIA, and never becomes the pointer target for dragging. `drag.disabled` disables only the handle: it cannot start a drag or call drag callbacks, while `ReorderActions` remains independently controlled.

The package does not calculate order, indexes, target IDs or insertion points. Consumers own stable keyed `{#each}` rendering, item identity, hit testing, candidate calculation, mutation, persistence, failure policy and post-reorder focus. Keep keys based on item identity so a successful consumer mutation preserves the intended row and control identity after reorder.

During an active handle gesture, `onDragStart` receives the source ID exactly once. After the pointer crosses the internal 4 CSS pixel threshold, `onDragCandidate` is called only when the controlled semantic candidate changes, where identity is `sourceId`, `targetId`, and `position`. The candidate is always supplied by the consumer through `drag.candidate`; Giada UI does not expose pointer coordinates or native events. `onDrop` fires with the complete consumer-owned `{ sourceId, targetId, position }` candidate unchanged, and only from the active source row whose `drag.id` matches `candidate.sourceId`. Non-empty `sourceId` and `targetId` values must be trimmed, contain no whitespace, and must not match.

`position` means insertion `before` or `after` the candidate target. There is no `inside`, cross-list movement, generated IDs, sortable-list state, ghost manager, portal, keyboard drag mode, automatic announcement, `aria-grabbed`, `aria-dropeffect`, or `draggable=true`.

`pointercancel`, `lostpointercapture`, and Escape cancel the active gesture without dropping. Giada UI does not trap focus, restore focus or move focus after drop; focus policy belongs to the consumer mutation and keyed rendering. Pointer Events cover mouse, pen and touch. Only the explicit handle uses `touch-action: none`; page scrolling and selection are not disabled on the row or list.

Rows expose `data-giu-dragging="true"` only while their own handle gesture is active and `data-giu-drop-candidate="before|after"` only when their `drag.id` matches a valid candidate's `targetId`. The same complete candidate can be passed to the source and target rows; target-row presentation alone does not start a gesture or call drag callbacks. Do not encode consumer IDs in CSS class names.

`ReorderActions` renders move up then move down as native `type="button"` controls. Its exact labels come from `moveUpLabel` and `moveDownLabel`; callbacks receive no arguments. `canMoveUp` and `canMoveDown` default to `true` and alone determine disabled state, including first, last and single-row boundaries. Unknown untyped `size` values normalize to `default`, consistent with `Button`; supported values are `default` and `compact`.

`positionContext` is an optional grouped prop for the current row/action-group context:

```ts
export type ReorderActionsPositionContext = {
	id: string;
	text: string;
};
```

When supplied, both move buttons receive `aria-describedby` for one visually hidden, non-live description inside `ReorderActions`. The `id` must be globally unique, hydration-stable, non-empty after trimming and contain no whitespace. The `text` must be non-empty after trimming. Invalid runtime values fail closed: no description is rendered and buttons omit `aria-describedby`. Giada UI never generates or replaces IDs.

Consumers own position calculation, total calculation, wording, localization and stable identity. Prefer IDs derived from item identity, such as `gallery-${image.id}-reorder-context`. Do not derive IDs from array indexes that can change during reorder, because the same item would receive a different accessibility relationship after it moves. The examples here are illustrative English, not package-prescribed wording.

Example row states:

```svelte
<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={false}
	canMoveDown={images.length > 1}
	positionContext={{ id: `gallery-${first.id}-reorder-context`, text: 'Hero, position 1 of 4' }}
	onMoveUp={noop}
	onMoveDown={moveFirstDown}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={true}
	canMoveDown={true}
	positionContext={{ id: `gallery-${middle.id}-reorder-context`, text: 'Detail, position 2 of 4' }}
	onMoveUp={moveMiddleUp}
	onMoveDown={moveMiddleDown}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={true}
	canMoveDown={false}
	positionContext={{ id: `gallery-${last.id}-reorder-context`, text: 'Credits, position 4 of 4' }}
	onMoveUp={moveLastUp}
	onMoveDown={noop}
/>

<ReorderActions
	moveUpLabel="Move image up"
	moveDownLabel="Move image down"
	canMoveUp={false}
	canMoveDown={false}
	positionContext={{ id: `gallery-${only.id}-reorder-context`, text: 'Hero, only image' }}
	onMoveUp={noop}
	onMoveDown={noop}
/>
```

`ReorderActions` does not accept numeric `position` or `total`, arrays, item schemas, keyed loops, localization services, mutation ownership, live-region behavior or focus management. Existing button labels remain the consumer-provided accessible names; position context is an accessible description only.

`ReorderAnnouncement` is the Studio-only companion primitive for confirmed reorder outcomes. It renders one visually hidden polite `role="status"` live-region shell and no visible text. Consumers own item identity, item arrays, reorder intent handling, pointer drag candidate handling, mutation success or failure, position calculation, localization, the final announcement message, and the event key. `ReorderActions` only represents keyboard-equivalent reorder intent, optional drag only represents pointer intent, and `positionContext` only describes the current row/action-group context. Position context is never live and must not be used as, or point at, `ReorderAnnouncement`.

`eventKey` is the announcement event boundary. Message equality is irrelevant: changing the message while keeping the same `eventKey` is not a new announcement, while changing `eventKey` can announce the same message again. Use a consumer-owned monotonically increasing counter, confirmed mutation ID, or other existing stable event ID. Do not use `Date.now()` as the canonical event key. Use `null` when there is no confirmed reorder event, and pass `null` or blank `message` to fail closed without meaningful announcement text.

The lifecycle should be confirmed-state-only: intent, consumer mutation, confirmed state update, then `message` and `eventKey` update. Disabled controls or failed mutations should not update `eventKey`. Server rendering and initial hydration keep the live-region shell empty even if initial props contain a previous result, so stale preexisting state is not announced. The first announcement can occur only after a post-hydration `eventKey` change. Repeated identical messages with distinct event keys are cleared and reinserted across a Svelte tick boundary so assistive technology can receive each confirmed event.

`FormStatus` remains visible general operation feedback. `ReorderAnnouncement` is a visually hidden, event-driven companion specifically for confirmed `EditableList` reorder outcomes and does not compose or reuse `FormStatus`. Do not mirror the same reorder outcome into another live region, including `FormStatus` or `StatusNotice`, because that can produce duplicate announcements. If visible confirmation is needed, compose separate non-live text beside `ReorderAnnouncement`.

Consumers own arrays, schemas, keyed `{#each}` rendering and logical identity, add/remove/reorder mutations, cardinality, field names and IDs, `FormData`, validation, persistence, focus after mutation, and dirty tracking. Gallery and Meta therefore pass their own explicit empty condition, for example `isEmpty={images.length === 0}`. The Gallery minimum-one policy and Meta zero-row policy remain consumer-owned. Remove actions compose with the existing `Button`. Relations, cross-list drag and drop, combobox behavior, package-owned positional math, and any monolithic `DynamicFieldList` are explicitly excluded.

The public style hooks are isolated to `--giu-editable-list-*`, `--giu-editable-list-row-*`, `--giu-reorder-actions-*`, and `--giu-reorder-announcement-*`. Common hooks include `--giu-editable-list-row-gap`, `--giu-editable-list-row-padding`, `--giu-editable-list-row-border`, `--giu-editable-list-row-drag-handle-size`, `--giu-reorder-actions-gap`, `--giu-reorder-actions-control-size`, `--giu-reorder-announcement-size`, and `--giu-reorder-announcement-margin`.
