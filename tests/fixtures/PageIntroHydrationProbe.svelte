<script lang="ts">
	import PageIntro from '../../src/lib/studio/PageIntro.svelte';
</script>

<div data-testid="page-intro-hydration-probe">
	<PageIntro class="hydrated-intro">
		Hydrated introduction with <a href="/preview">a preview link</a>.
	</PageIntro>
	<PageIntro>Plain hydrated introduction.</PageIntro>
</div>
