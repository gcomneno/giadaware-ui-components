<script lang="ts">
	import SocialIcon from '../../src/lib/SocialIcon.svelte';
</script>

<div data-testid="social-icon-accessibility-probe">
	<a
		href="#instagram"
		aria-label="Seguici su Instagram"
	>
		<SocialIcon id="instagram" />
	</a>

	<SocialIcon
		id="github"
		decorative={false}
		ariaLabel="Profilo GitHub"
		title="GitHub"
	/>
</div>
