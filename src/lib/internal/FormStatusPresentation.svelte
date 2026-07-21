<script lang="ts">
	import { normalizeFormStatusTone } from './form-status.js';

	import type { FormStatusTone } from './form-status.js';

	type Props = {
		message: string;
		tone?: FormStatusTone;
		durationMs?: number | null;
		class?: string;
		style?: string;
	};

	let {
		message,
		tone = 'info',
		durationMs = null,
		class: className,
		style
	}: Props = $props();

	let dismissed = $state(false);
	const visible = $derived(Boolean(message) && !dismissed);
	const normalizedTone = $derived(normalizeFormStatusTone(tone));

	const role = $derived(
		normalizedTone === 'error' ? 'alert' : 'status'
	);
	const ariaLive = $derived(
		normalizedTone === 'error' ? 'assertive' : 'polite'
	);

	$effect(() => {
		dismissed = false;

		if (
			!message ||
			typeof durationMs !== 'number' ||
			!Number.isFinite(durationMs) ||
			durationMs <= 0
		) {
			return;
		}

		const maximumTimerDelayMs = 2_147_483_647;
		let remainingMs = durationMs;
		let timer: number | undefined;

		const scheduleNextChunk = () => {
			const delayMs = Math.min(remainingMs, maximumTimerDelayMs);

			timer = window.setTimeout(() => {
				remainingMs -= delayMs;

				if (remainingMs > 0) {
					scheduleNextChunk();
					return;
				}

				dismissed = true;
			}, delayMs);
		};

		scheduleNextChunk();

		return () => {
			if (timer !== undefined) {
				window.clearTimeout(timer);
			}
		};
	});
</script>

{#if visible && message}
	<p
		class={[`form-status form-status--${normalizedTone}`, className]}
		{style}
		{role}
		aria-live={ariaLive}
		aria-atomic="true"
		data-tone={normalizedTone}
	>
		{message}
	</p>
{/if}

<style>
	.form-status {
		box-sizing: border-box;
		margin: 0;
		padding: var(--giu-form-status-padding, 0.875rem 1rem);
		border: var(--giu-form-status-border-width, 1px) solid;
		border-radius: var(--giu-form-status-border-radius, 0.75rem);
		white-space: pre-wrap;
		line-height: var(--giu-form-status-line-height, 1.5);
	}

	.form-status--success {
		border-color: var(--giu-form-status-success-border, #176742);
		background: var(--giu-form-status-success-background, #e7f5ed);
		color: var(--giu-form-status-success-color, #145c3b);
	}

	.form-status--error {
		border-color: var(--giu-form-status-error-border, #9d2b2b);
		background: var(--giu-form-status-error-background, #fbeaea);
		color: var(--giu-form-status-error-color, #762020);
	}

	.form-status--warning {
		border-color: var(--giu-form-status-warning-border, #8a620d);
		background: var(--giu-form-status-warning-background, #fff4d6);
		color: var(--giu-form-status-warning-color, #654706);
	}

	.form-status--info {
		border-color: var(--giu-form-status-info-border, #245ca6);
		background: var(--giu-form-status-info-background, #eaf2fd);
		color: var(--giu-form-status-info-color, #173f75);
	}
</style>
