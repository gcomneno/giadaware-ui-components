<script lang="ts">
	import SocialIcon from './SocialIcon.svelte';
	import {
		normalizeSocialLinkHref,
		resolveSocialLinkRenderState
	} from './social-link.js';

	import type { SocialLinkProps as Props } from './social-link.js';

	let {
		id,
		href,
		iconSize = 24,
		label,
		children,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	function sanitizeNativeAttributes<T extends object>(attributes: T): T {
		const sanitized = { ...attributes };

		Reflect.deleteProperty(sanitized, 'aria-label');
		Reflect.deleteProperty(sanitized, 'aria-labelledby');

		return sanitized;
	}

	const normalizedHref = $derived(normalizeSocialLinkHref(href));
	const renderState = $derived(
		resolveSocialLinkRenderState(id, children !== undefined, label)
	);
</script>

{#if normalizedHref && renderState}
	<a
		{...sanitizeNativeAttributes(nativeAttributes)}
		href={normalizedHref}
		aria-label={renderState.ariaLabel}
		class={[
			'giu-social-link',
			children ? 'giu-social-link--labelled' : 'giu-social-link--icon-only',
			className
		]}
		{style}
	>
		<SocialIcon id={renderState.id} size={iconSize} />
		{#if children}
			<span class="giu-social-link__label">
				{@render children()}
			</span>
		{/if}
	</a>
{/if}

<style>
	.giu-social-link {
		display: inline-flex;
		align-items: center;
		gap: var(--giu-social-link-gap, 0.5rem);
		box-sizing: border-box;
		border-radius: var(--giu-social-link-border-radius, 0.375rem);
		color: var(--giu-social-link-color, currentColor);
		text-decoration: var(--giu-social-link-text-decoration, none);
		font: inherit;
	}

	.giu-social-link:hover {
		color: var(--giu-social-link-hover-color, currentColor);
		text-decoration: var(
			--giu-social-link-hover-text-decoration,
			underline
		);
	}

	.giu-social-link:focus-visible {
		outline: var(--giu-social-link-focus-width, 3px) solid
			var(--giu-social-link-focus-color, #1559a6);
		outline-offset: var(--giu-social-link-focus-offset, 2px);
	}

	.giu-social-link__label {
		min-width: 0;
	}
</style>
