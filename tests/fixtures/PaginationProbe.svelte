<script lang="ts">
	import Pagination from '../../src/lib/studio/Pagination.svelte';

	type Props = {
		page?: number;
		pageCount?: number;
	};

	let {
		page = 2,
		pageCount = 4
	}: Props = $props();

	let requestedPage = $state<number | null>(null);
	let requestCount = $state(0);

	const labels = {
		navigation: 'Results pages',
		previous: 'Previous',
		next: 'Next',
		page: (value: number) => `Go to page ${value}`
	};

	function handlePageChange(nextPage: number): void {
		requestedPage = nextPage;
		requestCount += 1;
	}
</script>

<div
	data-testid="pagination-probe"
	data-requested-page={requestedPage ?? 'none'}
	data-request-count={requestCount}
>
	<Pagination
		{page}
		{pageCount}
		onpagechange={handlePageChange}
		{labels}
	/>
</div>
