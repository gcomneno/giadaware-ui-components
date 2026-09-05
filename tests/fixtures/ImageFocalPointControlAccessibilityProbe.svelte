<script lang="ts">
	import ImageFocalPointControl from '../../src/lib/studio/ImageFocalPointControl.svelte';
	import type {
		ImageFocalPointImage,
		ImageFocalPointValue
	} from '../../src/lib/studio/image-focal-point-control.js';

	const image = (
		src: string,
		alt: string
	): ImageFocalPointImage => ({ src, alt });

	let empty = $state<ImageFocalPointValue | null>(null);
	let emptyCount = $state(0);

	function updateEmpty(next: ImageFocalPointValue): void {
		emptyCount += 1;
		empty = next;
	}

	function noop(_next: ImageFocalPointValue): void {}
</script>

<div
	data-testid="image-focal-point-control-accessibility-probe"
	data-empty-count={emptyCount}
>
	<ImageFocalPointControl
		image={image('/empty.jpg', 'Empty-state focal preview')}
		value={empty}
		onvaluechange={updateEmpty}
		label="Choose empty focal point"
		id="empty-focal"
	/>
	<div data-testid="current-focal">
		<ImageFocalPointControl
			image={image('/current.jpg', 'Current focal preview')}
			value={{ x: 0.25, y: 0.75 }}
			onvaluechange={noop}
			label="Choose current focal point"
			id="current-focal"
		/>
	</div>
	<ImageFocalPointControl
		image={image('/disabled.jpg', 'Disabled focal preview')}
		value={{ x: 0.5, y: 0.5 }}
		onvaluechange={noop}
		label="Choose disabled focal point"
		id="disabled-focal"
		disabled
	/>
</div>
