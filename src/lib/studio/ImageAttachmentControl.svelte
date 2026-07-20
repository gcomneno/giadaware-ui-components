<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { tick } from 'svelte';
	import {
		cancelImageAttachmentRemoval,
		cancelImageAttachmentReplacement,
		chooseImageAttachmentRemoval,
		normalizeImageAttachmentState,
		selectImageAttachmentFile,
		validateImageAttachmentFile
	} from './image-attachment-control.js';

	import type {
		ImageAttachmentControlLabels,
		ImageAttachmentCurrentImage,
		ImageAttachmentFileValidator,
		ImageAttachmentState
	} from './image-attachment-control.js';

	type Props = {
		value: ImageAttachmentState;
		onvaluechange: (value: ImageAttachmentState) => void;
		currentImage?: ImageAttachmentCurrentImage | null;
		disabled?: boolean;
		accept?: string;
		maxSizeBytes?: number;
		validator?: ImageAttachmentFileValidator;
		invalidTypeMessage: string;
		tooLargeMessage: string;
		labels: ImageAttachmentControlLabels;
		name?: string;
		id?: string;
		class?: string;
		style?: string;
	};

	let {
		value,
		onvaluechange,
		currentImage = null,
		disabled = false,
		accept = 'image/*',
		maxSizeBytes = undefined,
		validator = undefined,
		invalidTypeMessage,
		tooLargeMessage,
		labels,
		name = undefined,
		id = undefined,
		class: className = undefined,
		style = undefined
	}: Props = $props();

	const generatedId = $props.id();
	const inputId = $derived(id ?? `${generatedId}-input`);
	const errorId = $derived(`${inputId}-error`);
	const rendered = $derived(normalizeImageAttachmentState(value, currentImage));

	let input: HTMLInputElement;
	let cancelRemovalButton = $state<HTMLButtonElement>();
	let validationError = $state<string | null>(null);
	let replacementPreviewUrl = $state<string | null>(null);
	let normalizationContextInitialized = false;
	let lastNormalizationIntent: unknown;
	let lastNormalizationFile: unknown;
	let lastNormalizationHasCurrentImage = false;
	let errorContextInitialized = false;
	let errorStateIntent: ImageAttachmentState['intent'] | undefined;
	let errorStateFile: File | null | undefined;
	let errorCurrentSrc: string | undefined;
	let errorCurrentAlt: string | undefined;
	let errorCurrentName: string | undefined;
	let transitionPending = false;

	function isSemanticallyNormalized(raw: unknown, normalized: ImageAttachmentState): boolean {
		if (typeof raw !== 'object' || raw === null) return false;
		const candidate = raw as { intent?: unknown; file?: unknown };
		return candidate.intent === normalized.intent && candidate.file === normalized.file;
	}

	function matchesState(left: ImageAttachmentState, right: ImageAttachmentState): boolean {
		return left.intent === right.intent && left.file === right.file;
	}

	function reconcileNativeSelection(): void {
		const selected = input?.files?.[0];
		const expected = rendered.intent === 'replace' ? rendered.file : undefined;
		if (selected && selected !== expected) input.value = '';
	}

	async function requestTransition(
		next: ImageAttachmentState,
		options: {
			focus?: 'input' | 'cancel-removal';
			clearInput?: boolean;
		} = {}
	): Promise<void> {
		const original = rendered;
		if (matchesState(next, original)) return;
		transitionPending = true;
		try {
			onvaluechange(next);
			await tick();
			if (!matchesState(rendered, next)) {
				reconcileNativeSelection();
				return;
			}
			if (options.clearInput) input.value = '';
			if (options.focus === 'input') input?.focus();
			if (options.focus === 'cancel-removal') cancelRemovalButton?.focus();
		} finally {
			transitionPending = false;
		}
	}

	function handleFileChange(event: Event): void {
		if (disabled) return;
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) {
			validationError = null;
			return;
		}
		const error = validateImageAttachmentFile(file, {
			accept,
			maxSizeBytes,
			validator,
			messages: { invalidType: invalidTypeMessage, tooLarge: tooLargeMessage }
		});
		if (error) {
			validationError = error.message;
			target.value = '';
			target.focus();
			return;
		}
		validationError = null;
		void requestTransition(selectImageAttachmentFile(rendered, file, disabled));
	}

	function cancelReplacement(): void {
		if (disabled) return;
		void requestTransition(cancelImageAttachmentReplacement(rendered, disabled), {
			focus: 'input',
			clearInput: true
		});
	}

	function chooseRemoval(): void {
		if (disabled) return;
		void requestTransition(chooseImageAttachmentRemoval(rendered, currentImage, disabled), {
			focus: 'cancel-removal',
			clearInput: true
		});
	}

	function cancelRemoval(): void {
		if (disabled) return;
		void requestTransition(cancelImageAttachmentRemoval(rendered, disabled), { focus: 'input' });
	}

	$effect(() => {
		const raw = value as unknown as { intent?: unknown; file?: unknown };
		const rawIntent = raw?.intent;
		const rawFile = raw?.file;
		const hasCurrentImage = currentImage !== null;
		if (
			normalizationContextInitialized &&
			rawIntent === lastNormalizationIntent &&
			rawFile === lastNormalizationFile &&
			hasCurrentImage === lastNormalizationHasCurrentImage
		) return;
		normalizationContextInitialized = true;
		lastNormalizationIntent = rawIntent;
		lastNormalizationFile = rawFile;
		lastNormalizationHasCurrentImage = hasCurrentImage;
		if (!isSemanticallyNormalized(value, rendered)) onvaluechange(rendered);
	});

	$effect(() => {
		const meaningfullyChanged = errorContextInitialized && (rendered.intent !== errorStateIntent
			|| rendered.file !== errorStateFile
			|| currentImage?.src !== errorCurrentSrc
			|| currentImage?.alt !== errorCurrentAlt
			|| currentImage?.name !== errorCurrentName);
		errorContextInitialized = true;
		errorStateIntent = rendered.intent;
		errorStateFile = rendered.file;
		errorCurrentSrc = currentImage?.src;
		errorCurrentAlt = currentImage?.alt;
		errorCurrentName = currentImage?.name;
		if (meaningfullyChanged) validationError = null;
	});

	$effect(() => {
		if (!input || transitionPending) return;
		reconcileNativeSelection();
	});

	$effect(() => {
		if (!BROWSER || rendered.intent !== 'replace') {
			replacementPreviewUrl = null;
			return;
		}
		const create = URL.createObjectURL;
		const revoke = URL.revokeObjectURL;
		if (typeof create !== 'function' || typeof revoke !== 'function') {
			replacementPreviewUrl = null;
			return;
		}
		let objectUrl: string;
		try {
			objectUrl = create.call(URL, rendered.file);
		} catch {
			replacementPreviewUrl = null;
			return;
		}
		replacementPreviewUrl = objectUrl;
		return () => revoke.call(URL, objectUrl);
	});
</script>

<div
	class={['image-attachment-control', `image-attachment-control--${rendered.intent}`, className]}
	{style}
	data-intent={rendered.intent}
>
	{#if rendered.intent === 'replace'}
		<div class="image-attachment-control__preview">
			{#if replacementPreviewUrl}
				<img src={replacementPreviewUrl} alt={labels.replacementPreviewAlt} />
			{:else}
				<div class="image-attachment-control__placeholder" aria-hidden="true"></div>
			{/if}
		</div>
		<p class="image-attachment-control__filename">{rendered.file.name}</p>
	{:else if currentImage}
		<div class="image-attachment-control__preview">
			<img src={currentImage.src} alt={currentImage.alt} />
		</div>
		{#if currentImage.name}<p class="image-attachment-control__filename">{currentImage.name}</p>{/if}
	{/if}

	<p class="image-attachment-control__status" role="status" aria-live="polite" aria-atomic="true">
		{#if rendered.intent === 'replace'}{labels.replaceStatus}
		{:else if rendered.intent === 'remove'}{labels.removeStatus}
		{:else if currentImage}{labels.keepExistingStatus}
		{:else}{labels.keepEmptyStatus}{/if}
	</p>

	<div class="image-attachment-control__field">
		<label for={inputId}>{labels.input}</label>
		<input
			bind:this={input}
			type="file"
			id={inputId}
			{name}
			{accept}
			{disabled}
			aria-invalid={validationError ? 'true' : undefined}
			aria-describedby={validationError ? errorId : undefined}
			onchange={handleFileChange}
		/>
	</div>

	{#if validationError}
		<p id={errorId} class="image-attachment-control__error" role="alert" aria-live="assertive" aria-atomic="true">
			{validationError}
		</p>
	{/if}

	<div class="image-attachment-control__actions">
		{#if rendered.intent === 'replace'}
			<button type="button" {disabled} onclick={cancelReplacement}>{labels.cancelReplacement}</button>
		{:else if rendered.intent === 'remove'}
			<button bind:this={cancelRemovalButton} type="button" {disabled} onclick={cancelRemoval}>{labels.cancelRemoval}</button>
		{/if}
		{#if currentImage && rendered.intent !== 'remove'}
			<button type="button" {disabled} onclick={chooseRemoval}>{labels.remove}</button>
		{/if}
	</div>
</div>

<style>
	.image-attachment-control {
		display: flex;
		flex-direction: column;
		gap: var(--giu-image-attachment-gap, 0.75rem);
		box-sizing: border-box;
		min-width: 0;
		padding: var(--giu-image-attachment-padding, 1rem);
		border: var(--giu-image-attachment-border-width, 1px) solid var(--giu-image-attachment-border-color, #767676);
		border-radius: var(--giu-image-attachment-border-radius, 0.5rem);
		color: var(--giu-image-attachment-color, #202020);
		background: var(--giu-image-attachment-background, #ffffff);
	}

	.image-attachment-control__preview,
	.image-attachment-control__placeholder {
		width: var(--giu-image-attachment-preview-width, 10rem);
		max-width: 100%;
		height: var(--giu-image-attachment-preview-height, 10rem);
		border-radius: var(--giu-image-attachment-preview-radius, 0.375rem);
		overflow: hidden;
	}

	.image-attachment-control__preview img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: var(--giu-image-attachment-object-fit, cover);
	}

	.image-attachment-control__placeholder {
		box-sizing: border-box;
		border: var(--giu-image-attachment-placeholder-border-width, 1px) dashed var(--giu-image-attachment-placeholder-border-color, #767676);
		background: var(--giu-image-attachment-placeholder-background, #eeeeee);
	}

	.image-attachment-control__status,
	.image-attachment-control__filename,
	.image-attachment-control__error { margin: 0; }

	.image-attachment-control__status { color: var(--giu-image-attachment-status-color, #303030); }
	.image-attachment-control__error { color: var(--giu-image-attachment-error-color, #9d2020); }
	.image-attachment-control__filename { overflow-wrap: anywhere; }

	.image-attachment-control__field,
	.image-attachment-control__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--giu-image-attachment-control-gap, 0.5rem);
		min-width: 0;
	}

	.image-attachment-control input { max-width: 100%; }

	.image-attachment-control button {
		padding: var(--giu-image-attachment-action-padding, 0.5rem 0.75rem);
		border: var(--giu-image-attachment-action-border-width, 1px) solid var(--giu-image-attachment-action-border-color, #555555);
		border-radius: var(--giu-image-attachment-action-radius, 0.375rem);
		color: var(--giu-image-attachment-action-color, #202020);
		background: var(--giu-image-attachment-action-background, #ffffff);
		cursor: pointer;
	}

	.image-attachment-control :is(input, button):focus-visible {
		outline: var(--giu-image-attachment-focus-width, 3px) solid var(--giu-image-attachment-focus-color, #1559a6);
		outline-offset: var(--giu-image-attachment-focus-offset, 2px);
	}

	.image-attachment-control :is(input, button):disabled {
		opacity: var(--giu-image-attachment-disabled-opacity, 0.55);
		cursor: not-allowed;
	}
</style>
