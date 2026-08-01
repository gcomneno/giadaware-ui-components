<script lang="ts">
	import FieldLabel from '../../src/lib/studio/FieldLabel.svelte';

	let interactionCount = $state(0);
</script>

<div
	data-testid="field-label-hydration-probe"
	data-interaction-count={interactionCount}
>
	<label for="hydration-email">
		<FieldLabel
			label="Email"
			required
			requiredLabel="Required"
			hint="Used for account notifications."
			hintId="hydration-email-hint"
		/>
	</label>

	<input
		id="hydration-email"
		name="email"
		required
		aria-describedby="hydration-email-hint"
		oninput={() => interactionCount += 1}
	/>

	<label>
		<FieldLabel
			label="Nickname"
			optional
			optionalLabel="Optional"
		/>

		<input
			name="nickname"
			oninput={() => interactionCount += 1}
		/>
	</label>

	<label>
		<FieldLabel
			label="Account code"
			required
			optional
			requiredLabel="Required field"
			optionalLabel="Optional field"
		/>

		<input
			name="account-code"
			required
			oninput={() => interactionCount += 1}
		/>
	</label>

	<label>
		<FieldLabel
			label="Internal reference"
			required
			requiredLabel="   "
			hint="   "
			hintId="unused-hint"
		/>

		<input
			name="internal-reference"
			required
			oninput={() => interactionCount += 1}
		/>
	</label>
</div>
