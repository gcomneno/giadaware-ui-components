import type { RelationshipGraphLabels } from '../../src/lib/visitor/relationship-graph.js';

export const relationshipGraphLabels = {
	region: 'Relationship graph',
	controls: 'Graph controls',
	zoomIn: 'Zoom in',
	zoomOut: 'Zoom out',
	resetView: 'Reset view',
	fitGraph: 'Fit graph',
	panUp: 'Pan up',
	panDown: 'Pan down',
	panLeft: 'Pan left',
	panRight: 'Pan right',
	empty: 'No relationships to display.',
	summary: ({ nodeCount, edgeCount }) => `${nodeCount} nodes, ${edgeCount} directed relationships.`,
	relationship: ({ sourceLabel, targetLabel, relationship }) =>
		relationship
			? `${sourceLabel} to ${targetLabel}: ${relationship}`
			: `${sourceLabel} to ${targetLabel}`
} satisfies RelationshipGraphLabels;
