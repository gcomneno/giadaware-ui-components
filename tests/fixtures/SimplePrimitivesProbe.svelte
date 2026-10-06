<script lang="ts">
	import TextInput from '../../src/lib/studio/TextInput.svelte';
	import Textarea from '../../src/lib/studio/Textarea.svelte';
	import Select from '../../src/lib/studio/Select.svelte';
	import Disclosure from '../../src/lib/studio/Disclosure.svelte';
	import NavList from '../../src/lib/studio/NavList.svelte';
	import Table from '../../src/lib/studio/Table.svelte';
	import TableCaption from '../../src/lib/studio/TableCaption.svelte';
	import TableHead from '../../src/lib/studio/TableHead.svelte';
	import TableBody from '../../src/lib/studio/TableBody.svelte';
	import TableRow from '../../src/lib/studio/TableRow.svelte';
	import TableHeaderCell from '../../src/lib/studio/TableHeaderCell.svelte';
	import TableCell from '../../src/lib/studio/TableCell.svelte';

	let textValue = $state('initial');
	let textareaValue = $state('notes');
	let singleValue = $state<string | null | undefined>('beta');
	let multipleValue = $state<string[]>(['alpha', 'gamma']);
	let disclosureOpen = $state(false);

	const navItems = [
		{
			href: '/overview',
			label: 'Overview',
			current: true
		},
		{
			href: '/settings',
			label: 'Settings',
			current: 'step' as const
		},
		{
			href: '/help',
			label: 'Help'
		}
	];
</script>

<div
	data-testid="simple-primitives-probe"
	data-text={textValue}
	data-textarea={textareaValue}
	data-single={singleValue ?? 'none'}
	data-multiple={multipleValue.join(',')}
	data-disclosure-open={disclosureOpen}
>
	<label for="simple-text">Text field</label>
	<TextInput
		id="simple-text"
		name="text"
		bind:value={textValue}
		placeholder="Type here"
	/>

	<label for="simple-textarea">Notes</label>
	<Textarea
		id="simple-textarea"
		name="notes"
		resize="both"
		bind:value={textareaValue}
	/>

	<label for="simple-single">Single choice</label>
	<Select
		id="simple-single"
		name="single"
		bind:value={singleValue}
	>
		<option value="alpha">Alpha</option>
		<option value="beta">Beta</option>
		<option value="gamma">Gamma</option>
	</Select>

	<label for="simple-multiple">Multiple choices</label>
	<Select
		id="simple-multiple"
		name="multiple"
		multiple
		bind:value={multipleValue}
	>
		<option value="alpha">Alpha</option>
		<option value="beta">Beta</option>
		<option value="gamma">Gamma</option>
	</Select>

	<Disclosure
		bind:open={disclosureOpen}
		data-testid="simple-disclosure"
	>
		{#snippet summary()}
			Technical details
		{/snippet}

		<p>Disclosure body</p>
	</Disclosure>

	<NavList
		aria-label="Project sections"
		items={navItems}
	/>

	<Table data-testid="simple-table">
		<TableCaption>Build status</TableCaption>

		<TableHead>
			<TableRow>
				<TableHeaderCell scope="col">
					Component
				</TableHeaderCell>
				<TableHeaderCell scope="col">
					Status
				</TableHeaderCell>
			</TableRow>
		</TableHead>

		<TableBody>
			<TableRow>
				<TableCell>TextInput</TableCell>
				<TableCell>Ready</TableCell>
			</TableRow>

			<TableRow>
				<TableCell>Textarea</TableCell>
				<TableCell>Ready</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</div>
