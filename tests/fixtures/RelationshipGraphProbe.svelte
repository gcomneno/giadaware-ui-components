<script lang="ts">
	import RelationshipGraph from '../../src/lib/visitor/RelationshipGraph.svelte';
	let selected = $state(''); let activated = $state(''); let source = $state('');
	const nodes = [{id:'a',label:'Alpha',href:'#alpha'},{id:'b',label:'Beta'},{id:'c',label:'Gamma'}];
	const edges = [{source:'a',target:'b',label:'supports'},{source:'a',target:'c'},{source:'b',target:'c',type:'lateral'}];
</script>
<div data-testid="relationship-probe" data-selected={selected} data-activated={activated} data-source={source} style="width: min(100%, 28rem)">
	<RelationshipGraph {nodes} {edges} onnodeselect={({node}) => selected=node.id} onnodeactivate={(detail) => { activated=detail.node.id; source=detail.source; }} />
</div>
