<script lang="ts">
	import type { PaginationProps as Props } from './pagination.js';

	let {
		page,
		pageCount,
		onpagechange,
		labels,
		class: className,
		style,
		...nativeAttributes
	}: Props = $props();

	const pages = $derived(
		Number.isInteger(pageCount) && pageCount > 0
			? Array.from(
					{ length: pageCount },
					(_, index) => index + 1
				)
			: []
	);

	const stateIsValid = $derived(
		Number.isInteger(page) &&
			Number.isInteger(pageCount) &&
			pageCount >= 1 &&
			page >= 1 &&
			page <= pageCount
	);

	function requestPage(nextPage: number): void {
		if (
			!stateIsValid ||
			nextPage === page ||
			nextPage < 1 ||
			nextPage > pageCount
		) {
			return;
		}

		onpagechange(nextPage);
	}
</script>

<nav
	{...nativeAttributes}
	aria-label={labels.navigation}
	class={['giu-pagination', className]}
	{style}
	data-giu-pagination-valid={stateIsValid ? 'true' : 'false'}
>
	<button
		type="button"
		class="giu-pagination__control giu-pagination__control--previous"
		disabled={!stateIsValid || page <= 1}
		onclick={() => requestPage(page - 1)}
	>
		{labels.previous}
	</button>

	<ol class="giu-pagination__pages">
		{#each pages as pageNumber}
			<li class="giu-pagination__page-item">
				<button
					type="button"
					class="giu-pagination__control giu-pagination__page"
					aria-label={labels.page(pageNumber)}
					aria-current={pageNumber === page ? 'page' : undefined}
					disabled={!stateIsValid}
					onclick={() => requestPage(pageNumber)}
				>
					{pageNumber}
				</button>
			</li>
		{/each}
	</ol>

	<button
		type="button"
		class="giu-pagination__control giu-pagination__control--next"
		disabled={!stateIsValid || page >= pageCount}
		onclick={() => requestPage(page + 1)}
	>
		{labels.next}
	</button>
</nav>

<style>
	.giu-pagination {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--giu-pagination-gap, 0.5rem);
		min-width: 0;
	}

	.giu-pagination__pages {
		display: flex;
		flex-wrap: wrap;
		gap: var(--giu-pagination-page-gap, 0.25rem);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.giu-pagination__page-item {
		margin: 0;
		padding: 0;
	}

	.giu-pagination__control {
		box-sizing: border-box;
		min-width: var(--giu-pagination-control-min-width, 2.5rem);
		min-height: var(--giu-pagination-control-min-height, 2.5rem);
		padding: var(--giu-pagination-control-padding, 0.4375rem 0.625rem);
		border: var(--giu-pagination-border-width, 1px) solid
			var(--giu-pagination-border-color, #767676);
		border-radius: var(--giu-pagination-border-radius, 0.375rem);
		color: var(--giu-pagination-color, #202020);
		background: var(--giu-pagination-background, #ffffff);
		font: inherit;
		cursor: pointer;
	}

	.giu-pagination__control:hover:not(:disabled) {
		background: var(--giu-pagination-hover-background, #eeeeee);
	}

	.giu-pagination__control:focus-visible {
		outline: var(--giu-pagination-focus-width, 3px) solid
			var(--giu-pagination-focus-color, #1559a6);
		outline-offset: var(--giu-pagination-focus-offset, 2px);
	}

	.giu-pagination__control[aria-current='page'] {
		border-color: var(
			--giu-pagination-current-border-color,
			#303030
		);
		color: var(--giu-pagination-current-color, #ffffff);
		background: var(--giu-pagination-current-background, #303030);
		font-weight: var(--giu-pagination-current-font-weight, 700);
	}

	.giu-pagination__control:disabled {
		cursor: not-allowed;
		opacity: var(--giu-pagination-disabled-opacity, 0.55);
	}

	@media (forced-colors: active) {
		.giu-pagination__control {
			border-color: ButtonText;
			color: ButtonText;
			background: ButtonFace;
		}

		.giu-pagination__control[aria-current='page'] {
			border-color: Highlight;
			color: HighlightText;
			background: Highlight;
		}

		.giu-pagination__control:focus-visible {
			outline-color: Highlight;
		}

		.giu-pagination__control:disabled {
			color: GrayText;
			opacity: 1;
		}
	}
</style>
