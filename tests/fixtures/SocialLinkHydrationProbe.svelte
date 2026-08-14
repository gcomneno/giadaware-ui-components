<script lang="ts">
	import SocialLink from '../../src/lib/SocialLink.svelte';

	let activationCount = $state(0);
</script>

{#snippet githubLabel()}
	<span>GitHub profile</span>
{/snippet}

<div
	data-testid="social-link-hydration-probe"
	data-activation-count={activationCount}
>
	<SocialLink
		id="instagram"
		href="/instagram"
		label="Instagram profile"
		iconSize={28}
		class="hydrated-social-link"
		aria-describedby="instagram-help"
		onclick={(event) => {
			event.preventDefault();
			activationCount += 1;
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
			activationCount += 10;
		}}
	/>
</div>
