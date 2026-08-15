<script lang="ts">
	import {
		normalizeStatusNoticeAnnouncement,
		normalizeStatusNoticeCloseLabel,
		normalizeStatusNoticeTone
	} from './status-notice.js';

	import type { StatusNoticeProps as Props } from './status-notice.js';

	let {
		title,
		children,
		icon,
		actions,
		tone = 'info',
		announcement,
		onDismiss,
		closeLabel,
		id,
		class: className,
		style
	}: Props = $props();

	const normalizedTone = $derived(normalizeStatusNoticeTone(tone));
	const normalizedAnnouncement = $derived(
		normalizeStatusNoticeAnnouncement(announcement)
	);
	const normalizedCloseLabel = $derived(
		normalizeStatusNoticeCloseLabel(closeLabel)
	);
	const canDismiss = $derived(
		typeof onDismiss === 'function' && Boolean(normalizedCloseLabel)
	);
	const announcementRole = $derived(
		normalizedAnnouncement === 'polite'
			? 'status'
			: normalizedAnnouncement === 'assertive'
				? 'alert'
				: undefined
	);
</script>

<div
	{id}
	class={[
		'giu-status-notice',
		`giu-status-notice--${normalizedTone}`,
		className
	]}
	{style}
	data-giu-tone={normalizedTone}
>
	{#if icon}
		<div class="giu-status-notice__icon" aria-hidden="true">
			{@render icon()}
		</div>
	{/if}

	<div
		class="giu-status-notice__announcement"
		role={announcementRole}
		aria-live={normalizedAnnouncement}
		aria-atomic={normalizedAnnouncement ? 'true' : undefined}
	>
		<div class="giu-status-notice__title">{title}</div>

		{#if children}
			<div class="giu-status-notice__body">
				{@render children()}
			</div>
		{/if}
	</div>

	{#if actions}
		<div class="giu-status-notice__actions">
			{@render actions()}
		</div>
	{/if}

	{#if canDismiss}
		<button
			class="giu-status-notice__dismiss"
			type="button"
			onclick={onDismiss}
		>
			{normalizedCloseLabel}
		</button>
	{/if}
</div>

<style>
	.giu-status-notice {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto;
		align-items: start;
		box-sizing: border-box;
		max-width: 100%;
		gap: var(--giu-status-notice-gap, 0.75rem);
		padding: var(--giu-status-notice-padding, 1rem);
		border: var(--giu-status-notice-border-width, 1px) solid var(--giu-status-notice-border-color, #245ca6);
		border-radius: var(--giu-status-notice-border-radius, 0.75rem);
		color: var(--giu-status-notice-color, #173f75);
		background: var(--giu-status-notice-background, #eaf2fd);
		line-height: var(--giu-status-notice-line-height, 1.5);
	}

	.giu-status-notice__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		color: var(--giu-status-notice-icon-color, currentColor);
	}

	.giu-status-notice__announcement {
		min-width: 0;
	}

	.giu-status-notice__title {
		font-weight: var(--giu-status-notice-title-font-weight, 700);
		overflow-wrap: anywhere;
	}

	.giu-status-notice__body {
		margin-top: var(--giu-status-notice-body-gap, 0.25rem);
		overflow-wrap: anywhere;
	}

	.giu-status-notice__body :where(:first-child) {
		margin-top: 0;
	}

	.giu-status-notice__body :where(:last-child) {
		margin-bottom: 0;
	}

	.giu-status-notice__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: var(--giu-status-notice-actions-gap, 0.5rem);
		min-width: 0;
	}

	.giu-status-notice__dismiss {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		min-height: var(--giu-status-notice-dismiss-min-size, 2.5rem);
		max-width: 100%;
		padding: var(--giu-status-notice-dismiss-padding, 0.5rem 0.75rem);
		border: var(--giu-status-notice-dismiss-border-width, 1px) solid var(--giu-status-notice-dismiss-border-color, currentColor);
		border-radius: var(--giu-status-notice-dismiss-border-radius, 0.5rem);
		color: var(--giu-status-notice-dismiss-color, currentColor);
		background: var(--giu-status-notice-dismiss-background, transparent);
		font: inherit;
		font-weight: var(--giu-status-notice-dismiss-font-weight, 600);
		line-height: 1.25;
		text-align: center;
		overflow-wrap: anywhere;
		cursor: pointer;
	}

	.giu-status-notice__dismiss:hover {
		background: var(--giu-status-notice-dismiss-hover-background, rgb(0 0 0 / 0.06));
	}

	.giu-status-notice__dismiss:focus-visible {
		outline: var(--giu-status-notice-focus-width, 3px) solid var(--giu-status-notice-focus-color, #1559a6);
		outline-offset: var(--giu-status-notice-focus-offset, 2px);
	}

	.giu-status-notice--success {
		--giu-status-notice-border-color: #176742;
		--giu-status-notice-background: #e7f5ed;
		--giu-status-notice-color: #145c3b;
	}

	.giu-status-notice--warning {
		--giu-status-notice-border-color: #8a620d;
		--giu-status-notice-background: #fff4d6;
		--giu-status-notice-color: #654706;
	}

	.giu-status-notice--error {
		--giu-status-notice-border-color: #9d2b2b;
		--giu-status-notice-background: #fbeaea;
		--giu-status-notice-color: #762020;
	}

	@media (max-width: 36rem) {
		.giu-status-notice {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.giu-status-notice__actions {
			grid-column: 2;
			justify-content: flex-start;
		}

		.giu-status-notice__dismiss {
			grid-column: 2;
			justify-self: start;
		}
	}
</style>
