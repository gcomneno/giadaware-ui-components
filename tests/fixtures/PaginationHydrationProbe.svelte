<script lang="ts">
	import Pagination from '../../src/lib/studio/Pagination.svelte';

	let page = $state(2);
	let requestCount = $state(0);

	const labels = {
		navigation: 'Hydration pages',
		previous: 'Previous page',
		next: 'Next page',
		page: (value: number) => `Page ${value}`
	};

	function handlePageChange(nextPage: number): void {
		page = nextPage;
		requestCount += 1;
	}
</script>

<div
	data-testid="pagination-hydration-probe"
	data-page={page}
	data-request-count={requestCount}
>
	<Pagination
		{page}
		pageCount={3}
		onpagechange={handlePageChange}
		{labels}
	/>
</div>
