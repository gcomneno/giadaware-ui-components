<script lang="ts">
	import {
		FieldDescription,
		FieldError,
		FieldLabel
	} from '../../src/lib/studio/index.js';

	let interactionCount = $state(0);
	let dynamicError = $state('');
</script>

<div
	data-testid="field-description-error-hydration-probe"
	data-interaction-count={interactionCount}
>
	<label for="hydration-email">
		<FieldLabel label="Email" />
	</label>
	<input
		id="hydration-email"
		aria-describedby="hydration-email-description"
		oninput={() => {
			interactionCount += 1;
		}}
	/>
	<FieldDescription
		id="hydration-email-description"
		text="Used for account notifications."
	/>

	<label for="hydration-code">
		<FieldLabel label="Account code" />
	</label>
	<input
		id="hydration-code"
		aria-invalid="true"
		aria-describedby="hydration-code-error"
	/>
	<FieldError
		id="hydration-code-error"
		text="Enter a valid account code."
	/>

	<label for="hydration-dynamic">
		<FieldLabel label="Dynamic value" />
	</label>
	<input
		id="hydration-dynamic"
		aria-invalid={dynamicError ? 'true' : undefined}
		aria-errormessage={dynamicError ? 'hydration-dynamic-error' : undefined}
	/>
	<button
		type="button"
		onclick={() => {
			dynamicError = 'This value is required.';
			interactionCount += 10;
		}}
	>
		Validate dynamic value
	</button>
	<FieldError
		id="hydration-dynamic-error"
		text={dynamicError}
		announce
	/>
</div>
