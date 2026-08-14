<script lang="ts">
	import {
		FieldDescription,
		FieldError,
		FieldLabel
	} from '../../src/lib/studio/index.js';

	let dynamicError = $state('');
</script>

<div data-testid="field-description-error-probe">
	<div data-testid="description-field">
		<label for="profile-email">
			<FieldLabel label="Email" />
		</label>
		<input
			id="profile-email"
			aria-describedby="profile-email-description"
		/>
		<FieldDescription
			id="profile-email-description"
			text="Used for account notifications."
			class="consumer-description"
			style="--giu-field-description-size: 1rem"
		/>
	</div>

	<div data-testid="static-error-field">
		<label for="account-code">
			<FieldLabel label="Account code" />
		</label>
		<input
			id="account-code"
			aria-invalid="true"
			aria-describedby="account-code-error"
		/>
		<FieldError
			id="account-code-error"
			text="Enter a valid account code."
			class="consumer-error"
			style="--giu-field-error-size: 1rem"
		/>
	</div>

	<div data-testid="combined-field">
		<label for="display-name">
			<FieldLabel label="Display name" />
		</label>
		<input
			id="display-name"
			aria-invalid="true"
			aria-describedby="display-name-description display-name-error"
		/>
		<FieldDescription
			id="display-name-description"
			text="Shown on your public profile."
		/>
		<FieldError
			id="display-name-error"
			text="Use at least three characters."
		/>
	</div>

	<div data-testid="dynamic-field">
		<label for="dynamic-value">
			<FieldLabel label="Dynamic value" />
		</label>
		<input
			id="dynamic-value"
			aria-invalid={dynamicError ? 'true' : undefined}
			aria-errormessage={dynamicError ? 'dynamic-value-error' : undefined}
		/>
		<button
			type="button"
			onclick={() => {
				dynamicError = 'This value is required.';
			}}
		>
			Show dynamic error
		</button>
		<FieldError
			id="dynamic-value-error"
			text={dynamicError}
			announce
		/>
	</div>

	<FieldDescription
		id="unused-description"
		text="   "
	/>
	<FieldError
		id="unused-error"
		text="   "
		announce
	/>
</div>
