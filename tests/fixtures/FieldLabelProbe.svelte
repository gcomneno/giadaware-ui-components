<script lang="ts">
	import FieldLabel from '../../src/lib/studio/FieldLabel.svelte';
</script>

<div data-testid="field-label-probe">
	<div data-testid="plain-field">
		<label for="plain-input">
			<FieldLabel label="Display name" />
		</label>
		<input id="plain-input" name="display-name" />
	</div>

	<div data-testid="required-field">
		<label for="required-input">
			<FieldLabel
				label="Email"
				required
				requiredLabel="Required"
				hint="Used for account notifications."
				hintId="required-hint"
				class="consumer-field-label"
				style="--giu-field-label-row-gap: 0.5rem; --giu-field-label-color: rgb(32, 32, 32)"
			/>
		</label>
		<input
			id="required-input"
			name="email"
			type="email"
			required
			aria-describedby="required-hint"
		/>
	</div>

	<div data-testid="optional-field">
		<label>
			<FieldLabel
				label="Nickname"
				optional
				optionalLabel="Optional"
			/>
			<input name="nickname" />
		</label>
	</div>

	<div data-testid="required-with-hint-field">
		<label for="required-with-hint-input">
			<FieldLabel
				label="Username"
				required
				requiredLabel="Required field"
				hint="Use letters, numbers and dashes."
				hintId="username-hint"
			/>
		</label>
		<input
			id="required-with-hint-input"
			name="username"
			required
			aria-describedby="username-hint"
		/>
	</div>

	<div data-testid="optional-with-hint-field">
		<label for="optional-with-hint-input">
			<FieldLabel
				label="Website"
				optional
				optionalLabel="Optional field"
				hint="Include the full URL."
				hintId="website-hint"
			/>
		</label>
		<input
			id="optional-with-hint-input"
			name="website"
			aria-describedby="website-hint"
		/>
	</div>

	<div data-testid="precedence-field">
		<label>
			<FieldLabel
				label="Account code"
				required
				optional
				requiredLabel="Required"
				optionalLabel="Optional"
			/>
			<input name="account-code" required />
		</label>
	</div>

	<div data-testid="fallback-field">
		<label>
			<FieldLabel
				label="Internal reference"
				required
				requiredLabel="   "
			/>
			<input name="internal-reference" required />
		</label>
	</div>
</div>
