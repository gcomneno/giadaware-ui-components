<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { onDestroy, tick } from 'svelte';
	import { acquireImageLightboxScrollLock } from './image-lightbox.js';

	import type { ImageLightboxProps as Props } from './image-lightbox.js';

	let {
		open,
		onopenchange,
		src,
		alt,
		labels,
		caption,
		actions,
		class: className,
		style
	}: Props = $props();

	let dialog = $state<HTMLDialogElement>();
	let closeButton = $state<HTMLButtonElement>();
	let stage = $state<HTMLDivElement>();
	let releaseScrollLock: (() => void) | undefined;
	let destroying = false;

	$effect(() => {
		if (!BROWSER || !dialog?.isConnected) return;

		if (open) {
			if (!dialog.open) {
				dialog.showModal();
				void focusCloseControl();
			}

			releaseScrollLock ??= acquireImageLightboxScrollLock(document);
			return;
		}

		if (dialog.open) {
			dialog.close();
		}

		releaseScrollLock?.();
		releaseScrollLock = undefined;
	});

	onDestroy(() => {
		destroying = true;

		if (dialog?.open) {
			dialog.close();
		}

		releaseScrollLock?.();
		releaseScrollLock = undefined;
	});

	async function focusCloseControl() {
		await tick();

		if (open && dialog?.open && closeButton?.isConnected) {
			closeButton.focus({ preventScroll: true });
		}
	}

	function requestClose() {
		onopenchange(false);
	}

	function handleCancel(event: Event) {
		event.preventDefault();
		requestClose();
	}

	async function handleDialogClose() {
		if (destroying || !open) return;

		onopenchange(false);
		await tick();

		if (open && dialog?.isConnected && !dialog.open) {
			dialog.showModal();
			void focusCloseControl();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialog || event.target === stage) {
			requestClose();
		}
	}
</script>

<dialog
	bind:this={dialog}
	class={['giu-image-lightbox', className]}
	{style}
	aria-label={labels.dialog}
	data-giu-image-lightbox
	oncancel={handleCancel}
	onclose={handleDialogClose}
	onclick={handleBackdropClick}
>
	<div class="giu-image-lightbox__panel">
		<button
			type="button"
			bind:this={closeButton}
			class="giu-image-lightbox__close"
			onclick={requestClose}
		>
			{labels.close}
		</button>

		<figure class="giu-image-lightbox__figure">
			<div bind:this={stage} class="giu-image-lightbox__stage">
				<img
					class="giu-image-lightbox__image"
					{src}
					{alt}
				/>
			</div>

			{#if caption}
				<figcaption class="giu-image-lightbox__caption">
					{@render caption()}
				</figcaption>
			{/if}
		</figure>

		{#if actions}
			<div class="giu-image-lightbox__actions">
				{@render actions()}
			</div>
		{/if}
	</div>
</dialog>

<style>
	.giu-image-lightbox {
		box-sizing: border-box;
		width: 100vw;
		max-width: none;
		height: 100vh;
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		color: var(--giu-image-lightbox-color, #ffffff);
		background: var(--giu-image-lightbox-background, rgb(12 12 12 / 0.96));
	}

	.giu-image-lightbox::backdrop {
		background: var(--giu-image-lightbox-backdrop, rgb(0 0 0 / 0.72));
	}

	.giu-image-lightbox__panel {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: var(--giu-image-lightbox-gap, 1rem);
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding:
			max(var(--giu-image-lightbox-padding, 1rem), env(safe-area-inset-top))
			max(var(--giu-image-lightbox-padding, 1rem), env(safe-area-inset-right))
			max(var(--giu-image-lightbox-padding, 1rem), env(safe-area-inset-bottom))
			max(var(--giu-image-lightbox-padding, 1rem), env(safe-area-inset-left));
	}

	.giu-image-lightbox__close {
		justify-self: end;
		min-height: 2.75rem;
		padding: var(--giu-image-lightbox-close-padding, 0.625rem 1rem);
		border: var(--giu-image-lightbox-close-border-width, 1px) solid
			var(--giu-image-lightbox-close-border-color, rgb(255 255 255 / 0.42));
		border-radius: var(--giu-image-lightbox-close-radius, 999px);
		color: var(--giu-image-lightbox-close-color, inherit);
		background: var(--giu-image-lightbox-close-background, rgb(255 255 255 / 0.1));
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.giu-image-lightbox__close:hover {
		background: var(--giu-image-lightbox-close-hover-background, rgb(255 255 255 / 0.18));
	}

	.giu-image-lightbox__close:focus-visible {
		outline: var(--giu-image-lightbox-focus-width, 3px) solid
			var(--giu-image-lightbox-focus-color, #ffffff);
		outline-offset: var(--giu-image-lightbox-focus-offset, 2px);
	}

	.giu-image-lightbox__figure {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: var(--giu-image-lightbox-caption-gap, 0.75rem);
		min-width: 0;
		min-height: 0;
		margin: 0;
	}

	.giu-image-lightbox__stage {
		display: grid;
		place-items: center;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.giu-image-lightbox__image {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.giu-image-lightbox__caption {
		max-width: var(--giu-image-lightbox-caption-max-width, 72ch);
		margin-inline: auto;
		color: var(--giu-image-lightbox-caption-color, rgb(255 255 255 / 0.82));
		line-height: 1.5;
		text-align: center;
	}
</style>
