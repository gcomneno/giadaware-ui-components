# EditableList, EditableListRow and ReorderActions

These primitives are available only from `giadaware-ui-components/studio`.

```svelte
<script lang="ts">
	import { EditableList, EditableListRow, ReorderActions } from 'giadaware-ui-components/studio';

	let images = $state([{ id: 'hero', title: 'Hero' }]);
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
				onMoveUp={() => { /* consumer mutation */ }}
				onMoveDown={() => { /* consumer mutation */ }}
			/>
		{/snippet}
		<EditableListRow position={index + 1} {fields} {actions} />
	{/each}
</EditableList>
```

`EditableList` owns a native `fieldset` and string `legend`, optional description and empty snippets, an ordered-list region, and an optional add-action region. `isEmpty` is a consumer-owned cardinality signal: `true` selects the `empty` snippet and suppresses the list; `false` selects the list when `children` is present. When omitted, children select rows mode and their absence selects empty mode. This preserves composition for static content but cannot determine whether a consumer `{#each}` has rows.

`EditableListRow` is a direct `li` with a visible one-based position, fields, then actions. Invalid runtime positions (non-finite, non-integer, or less than one) deterministically render as `1`. The visible number is hidden from assistive technology so the native list ordinal is not announced twice.

`ReorderActions` renders move up then move down as native `type="button"` controls. Its exact labels come from `moveUpLabel` and `moveDownLabel`; callbacks receive no arguments. `canMoveUp` and `canMoveDown` default to `true` and alone determine disabled state. Unknown untyped `size` values normalize to `default`, consistent with `Button`; supported values are `default` and `compact`.

Consumers own arrays, schemas, keyed `{#each}` rendering and logical identity, add/remove/reorder mutations, cardinality, field names and IDs, `FormData`, validation, persistence, focus after mutation, and dirty tracking. Gallery and Meta therefore pass their own explicit empty condition, for example `isEmpty={images.length === 0}`. The Gallery minimum-one policy and Meta zero-row policy remain consumer-owned. Remove actions compose with the existing `Button`. Relations, drag and drop, combobox behavior, and any monolithic `DynamicFieldList` are explicitly excluded.

The public style hooks are isolated to `--giu-editable-list-*`, `--giu-editable-list-row-*`, and `--giu-reorder-actions-*`. Common hooks include `--giu-editable-list-row-gap`, `--giu-editable-list-row-padding`, `--giu-editable-list-row-border`, `--giu-reorder-actions-gap`, and `--giu-reorder-actions-control-size`.
