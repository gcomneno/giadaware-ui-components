import { RelationshipGraph } from '../../src/lib/visitor/index.js';
import type {
	RelationshipGraphActivation,
	RelationshipGraphEdge,
	RelationshipGraphLabels,
	RelationshipGraphNode,
	RelationshipGraphProps,
	RelationshipGraphRelationshipDetail,
	RelationshipGraphSelection,
	RelationshipGraphSummaryDetail
} from '../../src/lib/visitor/index.js';

const node: RelationshipGraphNode = { id: 'a', label: 'Alpha', image: '/a.png', href: '/a' };
const edge: RelationshipGraphEdge = { source: 'a', target: 'b', type: 'shared', label: 'Supports' };

const labels: RelationshipGraphLabels = {
	region: 'Map',
	controls: 'Controls',
	zoomIn: 'Zoom in',
	zoomOut: 'Zoom out',
	resetView: 'Reset view',
	fitGraph: 'Fit graph',
	panUp: 'Pan up',
	panDown: 'Pan down',
	panLeft: 'Pan left',
	panRight: 'Pan right',
	empty: 'Empty',
	summary: (detail: RelationshipGraphSummaryDetail) => `${detail.nodeCount}/${detail.edgeCount}`,
	relationship: (detail: RelationshipGraphRelationshipDetail) =>
		`${detail.sourceLabel}/${detail.targetLabel}`
};

const props: RelationshipGraphProps = {
	nodes: [node],
	edges: [edge],
	labels,
	class: 'consumer',
	style: 'height:20rem',
	onnodeselect: (detail: RelationshipGraphSelection) => detail.node.id,
	onnodeactivate: (detail: RelationshipGraphActivation) => detail.source
};

// @ts-expect-error node id is required
const invalidNode: RelationshipGraphNode = { label: 'Bad' };

// @ts-expect-error edge target is required
const invalidEdge: RelationshipGraphEdge = { source: 'a' };

// @ts-expect-error labels are required
const missingLabels: RelationshipGraphProps = { nodes: [node] };

const invalidProps: RelationshipGraphProps = {
	labels,
	// @ts-expect-error callback receives a detail object, not a node
	onnodeselect: (value: string) => value
};

void [
	RelationshipGraph,
	node,
	edge,
	labels,
	props,
	invalidNode,
	invalidEdge,
	missingLabels,
	invalidProps
];
