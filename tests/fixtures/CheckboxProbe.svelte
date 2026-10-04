<script lang="ts">
	import Checkbox from '../../src/lib/studio/Checkbox.svelte';

	let accepted = $state(true);
	let newsletter = $state(false);
	let disabledChecked = $state(true);
	let changeCount = $state(0);
	let disabledCount = $state(0);
</script>

<div
	data-testid="checkbox-probe"
	data-accepted={accepted}
	data-newsletter={newsletter}
	data-change-count={changeCount}
	data-disabled-count={disabledCount}
>
	<p id="terms-help">Required before saving.</p>
	<form id="external-checkbox-form" data-testid="checkbox-form">
		<label>
			<Checkbox
				bind:checked={accepted}
				required
				name="terms"
				value="accepted"
				form="external-checkbox-form"
				aria-describedby="terms-help"
				data-consumer="forwarded"
				class="consumer-checkbox"
				style="--giu-checkbox-size: 1.5rem"
				onchange={() => changeCount += 1}
			/>
			Accept terms
		</label>

		<label>
			<Checkbox
				bind:checked={newsletter}
				name="newsletter"
				value="yes"
			/>
			Receive newsletter
		</label>

		<label>
			<Checkbox
				bind:checked={disabledChecked}
				disabled
				name="disabled-preference"
				value="yes"
				onchange={() => disabledCount += 1}
			/>
			Disabled preference
		</label>

		<fieldset>
			<legend>Topics</legend>
			<label>
				<Checkbox
					checked
					name="topics"
					value="design"
				/>
				Design topic
			</label>
			<label>
				<Checkbox
					name="topics"
					value="accessibility"
				/>
				Accessibility topic
			</label>
		</fieldset>

		<label for="separate-checkbox-label">Separate label</label>
		<Checkbox id="separate-checkbox-label" name="separate" value="yes" />

		<Checkbox aria-label="ARIA named checkbox" name="aria-named" value="yes" />
	</form>
</div>
