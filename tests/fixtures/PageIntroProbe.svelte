<script lang="ts">
	import PageIntro from '../../src/lib/studio/PageIntro.svelte';
</script>

<div data-testid="page-intro-probe">
	<PageIntro
		class="consumer-intro"
		style="--giu-page-intro-margin: 0; --giu-page-intro-color: rgb(32, 32, 32); --giu-page-intro-line-height: 1.75; --giu-page-intro-link-color: rgb(21, 89, 166)"
	>
		Manage the current document and <a href="/preview" target="_blank" rel="noreferrer">open its preview</a>.
	</PageIntro>

	<PageIntro>Plain introductory content.</PageIntro>
</div>
