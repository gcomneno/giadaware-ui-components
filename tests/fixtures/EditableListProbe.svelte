<script lang="ts">
	import { EditableList, EditableListRow, ReorderActions } from '../../src/lib/studio/index.js';
	let up = $state(0); let down = $state(0); let submitted = $state(0);
</script>

<form data-testid="editable-list-probe" onsubmit={(event) => { event.preventDefault(); submitted += 1; }} data-up={up} data-down={down} data-submitted={submitted}>
	{#snippet description()}Choose an order.{/snippet}
	{#snippet addAction()}<button type="button">Add image</button>{/snippet}
	{#snippet firstFields()}<label>First image <input name="first" /></label>{/snippet}
	{#snippet secondFields()}<label>Second image <input name="second" /></label>{/snippet}
	{#snippet firstActions()}<ReorderActions moveUpLabel="Move first image up" moveDownLabel="Move first image down" canMoveUp={false} onMoveUp={() => up += 1} onMoveDown={() => down += 1} />{/snippet}
	{#snippet secondActions()}<ReorderActions moveUpLabel="Move second image up" moveDownLabel="Move second image down" canMoveDown={false} onMoveUp={() => up += 1} onMoveDown={() => down += 1} />{/snippet}
	<EditableList legend="Gallery images" isEmpty={false} {description} {addAction}>
		<EditableListRow position={1} fields={firstFields} actions={firstActions} />
		<EditableListRow position={2} fields={secondFields} actions={secondActions} />
	</EditableList>
</form>
