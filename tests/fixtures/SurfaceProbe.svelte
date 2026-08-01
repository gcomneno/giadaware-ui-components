<script lang="ts">
	import Surface from '../../src/lib/studio/Surface.svelte';

	let actionCount = $state(0);
</script>

<div data-testid="surface-probe" data-action-count={actionCount}>
	<Surface>
		<form
			data-testid="surface-form"
			onsubmit={(event) => {
				event.preventDefault();
				actionCount += 1;
			}}
		>
			<label>
				Display name
				<input name="display-name" value="Giada" />
			</label>
			<button type="submit">Save</button>
		</form>
	</Surface>

	<nav aria-label="Resources">
		<Surface
			class="consumer-surface"
			style="--giu-surface-padding: 2rem; max-width: 30rem"
		>
			<a
				href="/docs"
				data-testid="surface-link"
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
