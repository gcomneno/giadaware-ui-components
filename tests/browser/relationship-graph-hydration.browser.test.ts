import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import RelationshipGraphHydrationProbe from '../fixtures/RelationshipGraphHydrationProbe.svelte';
import { RELATIONSHIP_GRAPH_HYDRATION_SSR_BODY } from '../fixtures/relationship-graph-hydration-contract.js';

test('hydrates deterministic graph markup without replacement or mismatch', async () => {
	const container = document.createElement('div');
	container.innerHTML = RELATIONSHIP_GRAPH_HYDRATION_SSR_BODY;
	document.body.append(container);
	const serverRoot = container.querySelector('[data-testid="relationship-graph-hydration"]');
	const serverPaths = [...container.querySelectorAll('svg path')];
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});
	let component: Record<string, unknown> | undefined;
	try {
		component = hydrate(RelationshipGraphHydrationProbe, { target: container, recover: false });
		await tick();
		expect(container.querySelector('[data-testid="relationship-graph-hydration"]')).toBe(serverRoot);
		expect([...container.querySelectorAll('svg path')]).toEqual(serverPaths);
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
		(container.querySelector('[data-giu-node-id="b"] button') as HTMLButtonElement).click();
		await vi.waitFor(() => expect(serverRoot).toHaveAttribute('data-selected', 'b'));
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
