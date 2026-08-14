<script lang="ts">
	import SocialLink from '../../src/lib/SocialLink.svelte';

	let count = $state(0);
</script>

{#snippet githubLabel()}
	<span>GitHub profile</span>
{/snippet}

<div data-testid="social-link-probe" data-count={count}>
	<SocialLink
		id="instagram"
		href="/instagram"
		label="Instagram profile"
		aria-describedby="instagram-help"
		data-consumer="forwarded"
		class="consumer-social-link"
		style="--giu-social-link-gap: 0.75rem"
		onclick={(event) => {
			event.preventDefault();
			count += 1;
		}}
	/>
	<span id="instagram-help">Instagram destination</span>

	<SocialLink
		id="github"
		href="/github"
		children={githubLabel}
		target="_blank"
		rel="me noreferrer"
		onclick={(event) => {
			event.preventDefault();
			count += 10;
		}}
	/>
</div>
