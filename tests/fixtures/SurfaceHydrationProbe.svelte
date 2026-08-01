<script lang="ts">
	import Surface from '../../src/lib/studio/Surface.svelte';

	let actionCount = $state(0);
</script>

<div
	data-testid="surface-hydration-probe"
	data-action-count={actionCount}
>
	<Surface>
		<button
			type="button"
			data-testid="surface-hydration-action"
			onclick={() => actionCount += 1}
		>
			Run action
		</button>
	</Surface>

	<nav aria-label="Resources">
		<Surface
			class="consumer-surface"
			style="--giu-surface-padding: 2rem"
		>
			<a
				href="/docs"
				data-testid="surface-hydration-link"
				onclick={(event) => {
					event.preventDefault();
					actionCount += 1;
				}}
			>
				Documentation
			</a>
		</Surface>
	</nav>
</div>
