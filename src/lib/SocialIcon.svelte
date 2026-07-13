<script lang="ts">
	import {
		normalizeSocialIconDimension,
		resolveSocialIconRenderState
	} from './social-icon-runtime.js';

	import type { SocialIconId } from './social-icon.js';

	type CommonProps = {
		id: SocialIconId;
		size?: number | string;
		width?: number | string;
		height?: number | string;
		class?: string;
		style?: string;
	};

	type DecorativeProps = {
		decorative?: true;
		ariaLabel?: string;
		title?: string;
	};

	type InformativeProps = {
		decorative: false;
		ariaLabel: string;
		title?: string;
	};

	type Props = CommonProps & (DecorativeProps | InformativeProps);

	let {
		id,
		size = 24,
		width,
		height,
		decorative = true,
		ariaLabel,
		title,
		class: className,
		style
	}: Props = $props();

	const normalizedSize = $derived(
		normalizeSocialIconDimension(size, '24px')
	);
	const normalizedWidth = $derived(
		normalizeSocialIconDimension(width, normalizedSize)
	);
	const normalizedHeight = $derived(
		normalizeSocialIconDimension(height, normalizedSize)
	);
	const renderState = $derived(
		resolveSocialIconRenderState(
			id,
			decorative,
			ariaLabel,
			title
		)
	);
</script>

{#if renderState}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		width={normalizedWidth}
		height={normalizedHeight}
		class={className}
		{style}
		focusable="false"
		aria-hidden={decorative ? 'true' : undefined}
		role={decorative ? undefined : 'img'}
		aria-label={renderState.ariaLabel}
	>
		{#if renderState.title}
			<title>{renderState.title}</title>
		{/if}
		<path d={renderState.path}></path>
	</svg>
{/if}
