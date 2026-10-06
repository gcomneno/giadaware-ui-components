<script lang="ts">
	import TextInput from '../../src/lib/studio/TextInput.svelte';
	import Textarea from '../../src/lib/studio/Textarea.svelte';
	import Select from '../../src/lib/studio/Select.svelte';
	import Disclosure from '../../src/lib/studio/Disclosure.svelte';

	let textValue = $state('server text');
	let textareaValue = $state('server notes');
	let selectValue = $state<string | null | undefined>('beta');
	let disclosureOpen = $state(true);
</script>

<div
	data-testid="simple-primitives-hydration-probe"
	data-text={textValue}
	data-textarea={textareaValue}
	data-select={selectValue ?? 'none'}
	data-open={disclosureOpen}
>
	<label for="hydration-text">Hydration text</label>
	<TextInput
		id="hydration-text"
		bind:value={textValue}
	/>

	<label for="hydration-textarea">Hydration notes</label>
	<Textarea
		id="hydration-textarea"
		bind:value={textareaValue}
	/>

	<label for="hydration-select">Hydration select</label>
	<Select
		id="hydration-select"
		bind:value={selectValue}
	>
		<option value="alpha">Alpha</option>
		<option value="beta">Beta</option>
	</Select>

	<Disclosure
		bind:open={disclosureOpen}
		data-testid="hydration-disclosure"
	>
		{#snippet summary()}
			Hydration disclosure
		{/snippet}

		<p>Hydration details</p>
	</Disclosure>
</div>
