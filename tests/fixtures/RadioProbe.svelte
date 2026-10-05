<script lang="ts">
	import Radio from '../../src/lib/studio/Radio.svelte';

	let selected = $state('normal');
	let disabledSelected = $state('disabled');
	let changeCount = $state(0);
	let disabledCount = $state(0);
</script>

<div
	data-testid="radio-probe"
	data-selected={selected}
	data-disabled-selected={disabledSelected}
	data-change-count={changeCount}
	data-disabled-count={disabledCount}
>
	<p id="importance-help">Choose one importance level.</p>

	<form id="external-radio-form" data-testid="radio-form">
		<fieldset>
			<legend>Importance</legend>

			<label>
				<Radio
					bind:group={selected}
					required
					name="importance"
					value="low"
					form="external-radio-form"
					aria-describedby="importance-help"
					data-consumer="forwarded"
					class="consumer-radio"
					style="--giu-radio-size: 1.5rem"
					onchange={() => changeCount += 1}
				/>
				Low importance
			</label>

			<label>
				<Radio
					bind:group={selected}
					name="importance"
					value="normal"
					form="external-radio-form"
				/>
				Normal importance
			</label>

			<label>
				<Radio
					bind:group={selected}
					name="importance"
					value="high"
					form="external-radio-form"
				/>
				High importance
			</label>
		</fieldset>

		<label>
			<Radio
				bind:group={disabledSelected}
				disabled
				name="disabled-choice"
				value="disabled"
				form="external-radio-form"
				onchange={() => disabledCount += 1}
			/>
			Disabled preference
		</label>

		<label for="separate-radio-label">Separate label</label>
		<Radio
			id="separate-radio-label"
			name="separate"
			value="yes"
			group="no"
		/>

		<Radio
			aria-label="ARIA named radio"
			name="aria-named"
			value="yes"
			group="no"
		/>
	</form>
</div>
