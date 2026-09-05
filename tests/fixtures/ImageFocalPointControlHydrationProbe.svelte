<script lang="ts">
	import ImageFocalPointControl from '../../src/lib/studio/ImageFocalPointControl.svelte';
	import type { ImageFocalPointValue } from '../../src/lib/studio/image-focal-point-control.js';

	let value = $state<ImageFocalPointValue>({ x: 0.25, y: 0.75 });
	let changeCount = $state(0);

	function handleValueChange(next: ImageFocalPointValue): void {
		changeCount += 1;
		value = next;
	}
</script>

<div
	data-testid="image-focal-point-control-hydration-probe"
	data-change-count={changeCount}
>
	<ImageFocalPointControl
		image={{
			src: '/images/hydration-focal-point.png',
			alt: 'Hydration focal image'
		}}
		{value}
		onvaluechange={handleValueChange}
		label="Choose image focal point"
		id="hydration-focal-point"
	/>
</div>
