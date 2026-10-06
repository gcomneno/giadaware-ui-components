<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { tick } from 'svelte';

	import type {
		ComboboxOption,
		ComboboxProps as Props
	} from './combobox.js';

	let {
		query,
		value = null,
		options,
		onquerychange,
		onvaluechange,
		id,
		disabled = false,
		class: className,
		style,
		listboxClass,
		listboxStyle,
		onclick,
		...nativeAttributes
	}: Props = $props();

	let open = $state(false);
	let activeIndex = $state(-1);
	let rootElement = $state<HTMLDivElement>();
	let inputElement = $state<HTMLInputElement>();
	let listboxElement = $state<HTMLDivElement>();

	const generatedId = $props.id();
	const rootId = $derived(id ?? generatedId);
	const inputId = $derived(`${rootId}-input`);
	const listboxId = $derived(`${rootId}-listbox`);

	const activeOptionId = $derived(
		open &&
		activeIndex >= 0 &&
		activeIndex < options.length &&
		!options[activeIndex]?.disabled
			? `${rootId}-option-${activeIndex}`
			: undefined
	);

	function enabledIndices(): number[] {
		const indices: number[] = [];

		for (
			let index = 0;
			index < options.length;
			index += 1
		) {
			if (!options[index]?.disabled) {
				indices.push(index);
			}
		}

		return indices;
	}

	function selectedEnabledIndex(): number {
		if (value === null) {
			return -1;
		}

		return options.findIndex(
			(option) =>
				option.value === value &&
				!option.disabled
		);
	}

	function boundaryIndex(
		boundary: 'first' | 'last'
	): number {
		const indices = enabledIndices();

		if (indices.length === 0) {
			return -1;
		}

		return boundary === 'first'
			? indices[0]
			: indices.at(-1) ?? -1;
	}

	function openingIndex(
		boundary: 'first' | 'last'
	): number {
		const selected = selectedEnabledIndex();

		if (selected !== -1) {
			return selected;
		}

		return boundaryIndex(boundary);
	}

	function openWithBoundary(
		boundary: 'first' | 'last'
	): void {
		if (disabled) {
			return;
		}

		open = true;
		activeIndex = openingIndex(boundary);
	}

	function close(): void {
		open = false;
		activeIndex = -1;
	}

	function moveActive(step: -1 | 1): void {
		const indices = enabledIndices();

		if (indices.length === 0) {
			activeIndex = -1;
			return;
		}

		const position = indices.indexOf(activeIndex);

		if (position === -1) {
			activeIndex =
				step === 1
					? indices[0]
					: indices.at(-1) ?? -1;
			return;
		}

		activeIndex =
			indices[
				(position + step + indices.length) %
					indices.length
			] ?? -1;
	}

	function selectOption(
		index: number
	): void {
		const option = options[index];

		if (disabled || !option || option.disabled) {
			return;
		}

		onvaluechange(option.value);
		close();

		inputElement?.focus({
			preventScroll: true
		});
	}

	async function reconcileRequestedQuery(
		requestedQuery: string
	): Promise<void> {
		await tick();

		if (
			inputElement?.isConnected &&
			inputElement.value === requestedQuery &&
			inputElement.value !== query
		) {
			inputElement.value = query;
		}
	}

	function handleInput(
		event: Event
	): void {
		if (disabled) {
			return;
		}

		const target = event.currentTarget;

		if (!(target instanceof HTMLInputElement)) {
			return;
		}

		const requestedQuery = target.value;

		onquerychange(requestedQuery);
		open = true;
		activeIndex = -1;

		void reconcileRequestedQuery(requestedQuery);
	}

	function handleKeydown(
		event: KeyboardEvent
	): void {
		if (disabled || event.isComposing) {
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			if (!open) {
				openWithBoundary('first');
			} else {
				moveActive(1);
			}

			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();

			if (!open) {
				openWithBoundary('last');
			} else {
				moveActive(-1);
			}

			return;
		}

		if (event.key === 'Enter' && open) {
			if (activeIndex !== -1) {
				event.preventDefault();
				selectOption(activeIndex);
			}

			return;
		}

		if (event.key === 'Escape' && open) {
			event.preventDefault();
			close();
			return;
		}

		if (event.key === 'Tab' && open) {
			close();
		}
	}

	function handleInputClick(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	): void {
		onclick?.(event);

		if (disabled) {
			return;
		}

		open = true;

		if (activeIndex === -1) {
			activeIndex = selectedEnabledIndex();
		}
	}

	function handleOptionPointerDown(
		event: PointerEvent
	): void {
		event.preventDefault();
	}

	function handleOptionKeydown(
		event: KeyboardEvent,
		index: number,
		option: ComboboxOption
	): void {
		if (
			option.disabled ||
			(event.key !== 'Enter' && event.key !== ' ')
		) {
			return;
		}

		event.preventDefault();
		selectOption(index);
	}

	function handleDocumentPointerDown(
		event: PointerEvent
	): void {
		if (!open) {
			return;
		}

		const target = event.target;

		if (
			!(target instanceof Node) ||
			rootElement?.contains(target)
		) {
			return;
		}

		close();
	}

	$effect(() => {
		if (
			activeIndex >= options.length ||
			options[activeIndex]?.disabled
		) {
			activeIndex = -1;
		}
	});

	$effect(() => {
		if (disabled && open) {
			close();
		}
	});

	$effect(() => {
		const index = activeIndex;
		const isOpen = open;

		if (
			!BROWSER ||
			!isOpen ||
			disabled ||
			index < 0
		) {
			return;
		}

		void tick().then(() => {
			if (
				!open ||
				disabled ||
				activeIndex !== index ||
				!listboxElement?.isConnected
			) {
				return;
			}

			const option =
				listboxElement.querySelector<HTMLElement>(
					`[data-giu-combobox-option-index="${index}"]`
				);

			if (!option) {
				return;
			}

			const optionTop = option.offsetTop;
			const optionBottom =
				optionTop + option.offsetHeight;
			const visibleTop = listboxElement.scrollTop;
			const visibleBottom =
				visibleTop + listboxElement.clientHeight;

			if (optionTop < visibleTop) {
				listboxElement.scrollTop = optionTop;
			} else if (optionBottom > visibleBottom) {
				listboxElement.scrollTop =
					optionBottom -
					listboxElement.clientHeight;
			}
		});
	});

	$effect(() => {
		if (!BROWSER || !open) {
			return;
		}

		document.addEventListener(
			'pointerdown',
			handleDocumentPointerDown
		);

		return () => {
			document.removeEventListener(
				'pointerdown',
				handleDocumentPointerDown
			);
		};
	});
</script>

<div
	bind:this={rootElement}
	id={rootId}
	class="giu-combobox"
	data-giu-combobox-open={open ? 'true' : 'false'}
>
	<input
		bind:this={inputElement}
		{...nativeAttributes}
		id={inputId}
		type="text"
		role="combobox"
		aria-autocomplete="list"
		aria-controls={listboxId}
		aria-expanded={open ? 'true' : 'false'}
		aria-activedescendant={activeOptionId}
		value={query}
		{disabled}
		class={['giu-combobox__input', className]}
		{style}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onclick={handleInputClick}
	/>

	<div
		bind:this={listboxElement}
		id={listboxId}
		role="listbox"
		hidden={!open}
		class={['giu-combobox__listbox', listboxClass]}
		style={listboxStyle}
	>
		{#each options as option, index (`${index}:${option.value}`)}
			<div
				id={`${rootId}-option-${index}`}
				role="option"
				tabindex="-1"
				aria-selected={option.value === value ? 'true' : 'false'}
				aria-disabled={option.disabled ? 'true' : undefined}
				class={[
					'giu-combobox__option',
					index === activeIndex &&
						'giu-combobox__option--active',
					option.disabled &&
						'giu-combobox__option--disabled'
				]}
				data-giu-combobox-option-index={index}
				onpointerenter={() => {
					if (!disabled && !option.disabled) {
						activeIndex = index;
					}
				}}
				onpointerdown={handleOptionPointerDown}
				onkeydown={(event) =>
					handleOptionKeydown(
						event,
						index,
						option
					)}
				onclick={() => selectOption(index)}
			>
				{option.label}
			</div>
		{/each}
	</div>
</div>

<style>
	.giu-combobox {
		position: relative;
		box-sizing: border-box;
		min-width: 0;
	}

	.giu-combobox__input {
		box-sizing: border-box;
		display: inline-block;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		min-height: var(--giu-combobox-min-height, 2.75rem);
		margin: 0;
		padding: var(--giu-combobox-padding, 0.625rem 0.75rem);
		border: var(--giu-combobox-border-width, 1px) solid
			var(--giu-combobox-border-color, #555555);
		border-radius: var(--giu-combobox-border-radius, 0.375rem);
		color: var(--giu-combobox-color, #202020);
		background: var(--giu-combobox-background, #ffffff);
		font: inherit;
		line-height: 1.25;
	}

	.giu-combobox__input:hover:not(:disabled) {
		border-color: var(--giu-combobox-hover-border-color, #202020);
	}

	.giu-combobox__input:focus-visible {
		border-color: var(--giu-combobox-focus-border-color, #1559a6);
		outline: var(--giu-combobox-focus-width, 3px) solid
			var(--giu-combobox-focus-color, #1559a6);
		outline-offset: var(--giu-combobox-focus-offset, 2px);
	}

	.giu-combobox__input:disabled {
		cursor: not-allowed;
		opacity: var(--giu-combobox-disabled-opacity, 0.55);
	}

	.giu-combobox__listbox {
		position: absolute;
		z-index: var(--giu-combobox-z-index, 20);
		inset-block-start: calc(
			100% + var(--giu-combobox-listbox-offset, 0.25rem)
		);
		inset-inline: 0;
		box-sizing: border-box;
		max-height: var(--giu-combobox-listbox-max-height, 16rem);
		overflow-y: auto;
		padding: var(--giu-combobox-listbox-padding, 0.25rem);
		border: var(--giu-combobox-listbox-border-width, 1px) solid
			var(--giu-combobox-listbox-border-color, #767676);
		border-radius: var(--giu-combobox-listbox-border-radius, 0.375rem);
		color: var(--giu-combobox-listbox-color, #202020);
		background: var(--giu-combobox-listbox-background, #ffffff);
		box-shadow: var(
			--giu-combobox-listbox-shadow,
			0 0.375rem 1rem rgb(0 0 0 / 0.18)
		);
	}

	.giu-combobox__listbox[hidden] {
		display: none;
	}

	.giu-combobox__option {
		box-sizing: border-box;
		padding: var(--giu-combobox-option-padding, 0.5rem 0.625rem);
		border-radius: var(--giu-combobox-option-border-radius, 0.25rem);
		cursor: pointer;
	}

	.giu-combobox__option--active {
		background: var(--giu-combobox-option-active-background, #eeeeee);
	}

	.giu-combobox__option[aria-selected='true'] {
		font-weight: var(--giu-combobox-option-selected-font-weight, 700);
	}

	.giu-combobox__option--disabled {
		cursor: not-allowed;
		opacity: var(--giu-combobox-disabled-opacity, 0.55);
	}

	@media (forced-colors: active) {
		.giu-combobox__input,
		.giu-combobox__listbox {
			border-color: CanvasText;
			color: CanvasText;
			background: Canvas;
			box-shadow: none;
		}

		.giu-combobox__input:focus-visible {
			border-color: Highlight;
			outline-color: Highlight;
		}

		.giu-combobox__option--active {
			color: HighlightText;
			background: Highlight;
		}

		.giu-combobox__option--disabled,
		.giu-combobox__input:disabled {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
