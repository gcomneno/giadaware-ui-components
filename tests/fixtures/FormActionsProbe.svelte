<script lang="ts">
	import FormActions from '../../src/lib/studio/FormActions.svelte';
	import type { FormActionsAlign } from '../../src/lib/studio/form-actions.js';

	let actionCount = $state(0);
	let keyCount = $state(0);
	let inputCount = $state(0);
	let submitCount = $state(0);
	const invalidAlign = 'distributed' as FormActionsAlign;
</script>

<div
	data-testid="form-actions-probe"
	data-action-count={actionCount}
	data-key-count={keyCount}
	data-input-count={inputCount}
	data-submit-count={submitCount}
>
	<FormActions
		class="consumer-actions"
		style="--giu-form-actions-gap: 20px"
	>
		<button
			type="button"
			name="intent"
			value="save"
			data-consumer-control="button"
			onclick={() => actionCount += 1}
			onkeydown={() => keyCount += 1}
		>Save</button
		>
		<a
			href="/preview"
			target="_blank"
			rel="noreferrer"
			data-consumer-control="link"
			>Preview</a
		>
		<label>
			Title
			<input
				name="title"
				value="Draft"
				data-consumer-control="input"
				oninput={() => inputCount += 1}
			/>
		</label>
		<form
			action="/publish"
			method="post"
			data-consumer-control="form"
			onsubmit={(event) => {
				event.preventDefault();
				submitCount += 1;
			}}
		>
			<button type="submit">Publish</button>
		</form>
	</FormActions>

	<FormActions align="center"><span>Center</span></FormActions>
	<FormActions align="end"><span>End</span></FormActions>
	<FormActions align="space-between"><span>First</span><span>Last</span></FormActions>
	<FormActions wrap={false}><span>Do not wrap</span></FormActions>
	<FormActions align={invalidAlign}><span>Invalid alignment</span></FormActions>
</div>
