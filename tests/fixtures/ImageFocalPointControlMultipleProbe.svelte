<script lang="ts">
	import ImageFocalPointControl from '../../src/lib/studio/ImageFocalPointControl.svelte';
	import type { ImageFocalPointValue } from '../../src/lib/studio/image-focal-point-control.js';

	let first = $state<ImageFocalPointValue>({ x: 0.25, y: 0.25 });
	let second = $state<ImageFocalPointValue>({ x: 0.75, y: 0.75 });
	let firstCount = $state(0);
	let secondCount = $state(0);

	function updateFirst(next: ImageFocalPointValue): void {
		firstCount += 1;
		first = next;
	}

	function updateSecond(next: ImageFocalPointValue): void {
		secondCount += 1;
		second = next;
	}
</script>

<div
	data-testid="image-focal-point-control-multiple-probe"
	data-first-count={firstCount}
	data-second-count={secondCount}
>
	<ImageFocalPointControl
		image={{
			src: '/first.jpg',
			alt: 'First focal image'
		}}
		value={first}
		onvaluechange={updateFirst}
		label="Choose first focal point"
		id="first-focal"
	/>
	<ImageFocalPointControl
		image={{
			src: '/second.jpg',
			alt: 'Second focal image'
		}}
		value={second}
		onvaluechange={updateSecond}
		label="Choose second focal point"
		id="second-focal"
	/>
</div>
