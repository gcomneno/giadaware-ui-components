<script lang="ts">
    import { RelationshipGraph, Button, Surface } from 'giadaware-ui-components';
    import type {
        RelationshipGraphNode, RelationshipGraphEdge, RelationshipGraphLabels
    } from 'giadaware-ui-components';

    const nodes: readonly RelationshipGraphNode[] = [
        { id: 'organization', label: 'Organization' },
        { id: 'design', label: 'Design' },
        { id: 'engineering', label: 'Engineering' },
        { id: 'platform', label: 'Shared platform' },
        { id: 'community', label: 'Community' }
    ];
    const edges: readonly RelationshipGraphEdge[] = [
        { source: 'organization', target: 'design', label: 'supports' },
        { source: 'organization', target: 'engineering', label: 'supports' },
        { source: 'design', target: 'platform', label: 'contributes' },
        { source: 'engineering', target: 'platform', label: 'maintains' },
        { source: 'design', target: 'engineering', label: 'collaborates' },
        { source: 'community', target: 'platform', label: 'uses' }
    ];
    const labels: RelationshipGraphLabels = {
        region: 'Sample relationships',
        controls: 'Sample graph controls',
        zoomIn: 'Zoom in', zoomOut: 'Zoom out',
        resetView: 'Reset view', fitGraph: 'Fit graph',
        panUp: 'Pan up', panDown: 'Pan down',
        panLeft: 'Pan left', panRight: 'Pan right',
        empty: 'No relationships to display.',
        summary: ({ nodeCount, edgeCount }) => `${nodeCount} nodes and ${edgeCount} directed relationships.`,
        relationship: ({ sourceLabel, targetLabel, relationship }) =>
            `${sourceLabel} to ${targetLabel}${relationship ? `: ${relationship}` : ''}`
    };

    let selection = $state<string | null>(null);
    let activation = $state<{ id: string; source: string } | null>(null);
    let resetKey = $state(0);

    function reset() {
        selection = null;
        activation = null;
        resetKey += 1;
    }
</script>

<p>Explore shared descendants and a lateral relationship. Select or activate nodes to update ordinary text; no routing occurs.</p>
<p>Use Tab to reach the graph, arrow keys to move between nodes, and Enter or Space to activate. Graph controls adjust the view.</p>

{#key resetKey}
    <RelationshipGraph
        {nodes} {edges} {labels}
        onnodeselect={({ node }) => selection = node.id}
        onnodeactivate={({ node, source }) => activation = { id: node.id, source }}
    />
{/key}

<Button variant="secondary" onclick={reset}>Reset relationships</Button>

<Surface class="demo-state">
    <p>Selected node: {selection ?? 'none'}.</p>
    <p>Last activation: {activation ? `${activation.id} by ${activation.source}` : 'none'}.</p>
    <pre>{JSON.stringify({ selection, activation, nodes, edges }, null, 2)}</pre>
</Surface>

<p class="demo-docs">
    Contract:
    <a href="https://github.com/gcomneno/giadaware-ui-components/blob/main/docs/relationship-graph.md">RelationshipGraph</a>.
</p>
