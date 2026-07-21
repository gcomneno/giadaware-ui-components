import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import RelationshipGraph from '../../src/lib/visitor/RelationshipGraph.svelte';
import RelationshipGraphHydrationProbe from '../fixtures/RelationshipGraphHydrationProbe.svelte';
import { RELATIONSHIP_GRAPH_HYDRATION_SSR_BODY } from '../fixtures/relationship-graph-hydration-contract.js';
import { fitRelationshipGraphViewport, layoutRelationshipGraph, normalizeRelationshipGraph, relationshipDescription } from '../../src/lib/visitor/relationship-graph.js';

describe('RelationshipGraph pure graph behavior', () => {
	test('normalizes deterministically without mutating caller input', () => {
		const nodes = [{ id: 'b', label: ' B ' }, { id: 'a', label: 'A' }];
		const edges = [{ source: 'b', target: 'a', label: ' knows ' }];
		const copy = JSON.stringify({ nodes, edges });
		const first = normalizeRelationshipGraph(nodes, edges);
		expect(first.nodes.map((node) => node.id)).toEqual(['a', 'b']);
		expect(first.edges[0].label).toBe('knows');
		expect(first).toEqual(normalizeRelationshipGraph([...nodes].reverse(), [...edges].reverse()));
		expect(JSON.stringify({ nodes, edges })).toBe(copy);
	});

	test('keeps non-ASCII normalization and layout identical across input permutations', () => {
		const nodes = [
			{ id: 'éclair', label: 'Éclair' },
			{ id: 'Ωmega', label: 'Omega' },
			{ id: 'Ångström', label: 'Angstrom' },
			{ id: '東京', label: 'Tokyo' }
		];
		const edges = [
			{ source: 'Ångström', target: 'éclair' },
			{ source: 'éclair', target: 'Ωmega' },
			{ source: 'Ωmega', target: 'Ångström' },
			{ source: '東京', target: 'éclair', label: '関連' }
		];
		const first = normalizeRelationshipGraph(nodes, edges);
		const second = normalizeRelationshipGraph(
			[nodes[2], nodes[0], nodes[3], nodes[1]],
			[edges[3], edges[1], edges[0], edges[2]]
		);
		expect(first).toEqual(second);
		expect(first.nodes.map((node) => node.id)).toEqual(['Ångström', 'éclair', 'Ωmega', '東京']);
		expect(layoutRelationshipGraph(first)).toEqual(layoutRelationshipGraph(second));
	});

	test('drops invalid and duplicate nodes and missing-endpoint edges', () => {
		const graph = normalizeRelationshipGraph([
			{ id: 'a', label: 'First' }, { id: 'a', label: 'Duplicate' },
			{ id: '', label: 'Bad' }, { id: 'b', label: '' }, null
		], [{ source: 'a', target: 'missing' }, { source: 'a', target: 'a', type: ' self ' }, {}]);
		expect(graph).toEqual({ nodes: [{ id: 'a', label: 'First' }], edges: [{ source: 'a', target: 'a', type: 'self' }] });
	});

	test('lays out shared, lateral, cyclic and disconnected relationships', () => {
		const graph = normalizeRelationshipGraph(
			['a','b','c','d','x','y'].map((id) => ({ id, label: id })),
			[{source:'a',target:'b'},{source:'a',target:'c'},{source:'b',target:'d'},{source:'c',target:'d'},{source:'b',target:'c'},{source:'x',target:'y'},{source:'y',target:'x'}]
		);
		const layout = layoutRelationshipGraph(graph);
		expect(layout.nodes).toHaveLength(6);
		expect(new Set(layout.nodes.map((node) => `${node.x}:${node.y}`)).size).toBe(6);
		expect(layout.nodes.find((node) => node.id === 'd')!.rank).toBeGreaterThan(layout.nodes.find((node) => node.id === 'a')!.rank);
		expect(layout.nodes.find((node) => node.id === 'x')!.rank).toBe(layout.nodes.find((node) => node.id === 'y')!.rank);
		expect(layout.edgeGeometry.map((edge) => edge.kind)).toContain('lateral');
		expect(layout).toEqual(layoutRelationshipGraph(graph));
	});

	test('ranks condensation components without inflation and routes non-forward edges around nodes', () => {
		const graph = normalizeRelationshipGraph(
			['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, label: id.toUpperCase() })),
			[{source:'a',target:'b'},{source:'b',target:'a'},{source:'b',target:'c'},{source:'c',target:'d'},{source:'d',target:'c'},{source:'d',target:'b'},{source:'e',target:'e'}]
		);
		const layout = layoutRelationshipGraph(graph);
		expect(layout.nodes.find((node) => node.id === 'a')!.rank).toBe(0);
		expect(layout.nodes.find((node) => node.id === 'c')!.rank).toBe(1);
		expect(layout.nodes.find((node) => node.id === 'e')!.rank).toBe(0);
		const kinds = Object.fromEntries(layout.edgeGeometry.map((edge) => [`${edge.source}-${edge.target}`, edge.kind]));
		expect(kinds).toMatchObject({'a-b':'lateral','b-c':'forward','d-b':'backward','e-e':'self'});
		for (const edge of layout.edgeGeometry) {
			expect(edge.path).toMatch(/^M /);
			expect(edge.arrowPath).toMatch(/^M /);
			const target = layout.pointsById.get(edge.target)!;
			expect(edge.path).not.toContain(` ${target.x} ${target.y} `);
		}
		expect(layout).toEqual(layoutRelationshipGraph(graph));
	});

	test('handles empty and single-node graphs and safe viewport fitting', () => {
		expect(layoutRelationshipGraph(normalizeRelationshipGraph([], []))).toMatchObject({ nodes: [], width: 0, height: 0 });
		expect(layoutRelationshipGraph(normalizeRelationshipGraph([{id:'only',label:'Only'}], [])).nodes).toHaveLength(1);
		expect(fitRelationshipGraphViewport(0, 0, 100, 100)).toEqual({ x: 0, y: 0, scale: 1 });
	});
});

describe('RelationshipGraph SSR', () => {
	test('produces deterministic hydration markup', () => {
		const first = render(RelationshipGraphHydrationProbe);
		expect(first).toEqual(render(RelationshipGraphHydrationProbe));
		expect(first.body).toBe(RELATIONSHIP_GRAPH_HYDRATION_SSR_BODY);
	});
	test('renders deterministic empty state with safe runtime defaults', () => {
		const first = render(RelationshipGraph, { props: { nodes: 'bad' as never, edges: null as never } });
		expect(first).toEqual(render(RelationshipGraph, { props: { nodes: 'bad' as never, edges: null as never } }));
		expect(first.body).toContain('No relationships to display.');
		expect(first.body).toContain('data-giu-empty="true"');
	});

	test('preserves link and button semantics and accessible edge summary', () => {
		const body = render(RelationshipGraph, { props: { nodes: [{id:'a',label:'Alpha',href:'/alpha'},{id:'b',label:'Beta'}], edges: [{source:'a',target:'b',label:'supports'}] } }).body;
		expect(body).toContain('<a href="/alpha"');
		expect(body).toContain('<button type="button"');
		expect(body).toContain('2 nodes, 1 directed relationships');
		expect(body).toContain('Alpha to Beta: supports');
		expect(body).toContain('aria-hidden="true"');
	});

	test('renders multiple instances without SVG fragment IDs or marker references', () => {
		const props = { nodes: [{id:'a',label:'Alpha'},{id:'b',label:'Beta'}], edges: [{source:'a',target:'b'}] };
		const body = `${render(RelationshipGraph, { props }).body}${render(RelationshipGraph, { props }).body}`;
		expect(body).not.toMatch(/<marker|marker-end=|url\(#|id="giu-relationship/);
		expect(body.match(/data-giu-edge-kind="forward"/g)).toHaveLength(2);
	});

	test('describes relationships using labels and label-before-type precedence', () => {
		const nodes = new Map([['a',{id:'a',label:'Alpha'}],['b',{id:'b',label:'Beta'}]]);
		expect(relationshipDescription({source:'a',target:'b',type:'peer'}, nodes)).toBe('Alpha to Beta: peer');
		expect(relationshipDescription({source:'a',target:'b',type:'peer',label:'Supports'}, nodes)).toBe('Alpha to Beta: Supports');
	});
});
