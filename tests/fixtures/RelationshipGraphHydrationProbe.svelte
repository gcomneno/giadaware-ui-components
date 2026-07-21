<script lang="ts">
	import RelationshipGraph from '../../src/lib/visitor/RelationshipGraph.svelte';
	let selected = $state('none');
	const nodes = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }];
	const edges = [{ source: 'a', target: 'b', label: 'supports' }];
</script>

<div data-testid="relationship-graph-hydration" data-selected={selected}>
	<RelationshipGraph {nodes} {edges} onnodeselect={({ node }) => selected = node.id} />
</div>
