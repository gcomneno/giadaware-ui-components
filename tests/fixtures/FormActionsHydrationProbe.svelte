<script lang="ts">
	import FormActions from '../../src/lib/studio/FormActions.svelte';
	import type { FormActionsAlign } from '../../src/lib/studio/form-actions.js';

	let align: FormActionsAlign = $state('start');
	let wrap = $state(true);
	let actionCount = $state(0);
	let keyCount = $state(0);
</script>

<div
	data-testid="form-actions-hydration-probe"
	data-align={align}
	data-wrap={wrap}
	data-action-count={actionCount}
	data-key-count={keyCount}
>
	<FormActions {align} {wrap} class="hydrated-actions">
		<button
			type="button"
			data-testid="hydrated-action"
			onclick={() => {
				actionCount += 1;
				align = 'space-between';
				wrap = false;
			}}
			onkeydown={() => keyCount += 1}
			>Hydrated action</button
		>
		<a href="/hydrated-preview">Hydrated preview</a>
		<input aria-label="Hydrated title" value="Draft" />
		<form
			action="/hydrated-publish"
			onsubmit={(event) => event.preventDefault()}
		>
			<button type="submit">Hydrated publish</button>
		</form>
	</FormActions>
</div>
