import { hydrate, tick, unmount } from 'svelte';
import { expect, test, vi } from 'vitest';
import FormActionsHydrationProbe from '../fixtures/FormActionsHydrationProbe.svelte';
import { FORM_ACTIONS_HYDRATION_SSR_BODY } from '../fixtures/form-actions-hydration-contract.js';

test('hydrates without replacement or activation and preserves children across reactive layout changes', async () => {
	const container = document.createElement('div');
	container.innerHTML = FORM_ACTIONS_HYDRATION_SSR_BODY;
	document.body.append(container);

	const serverRoot = container.querySelector('[data-testid="form-actions-hydration-probe"]') as HTMLElement;
	const serverActions = container.querySelector('.giu-form-actions') as HTMLDivElement;
	const serverButton = container.querySelector('[data-testid="hydrated-action"]') as HTMLButtonElement;
	const serverLink = container.querySelector('a');
	const serverInput = container.querySelector('input');
	const serverForm = container.querySelector('form');
	let component: Record<string, unknown> | undefined;
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const error = vi.spyOn(console, 'error').mockImplementation(() => {});

	try {
		component = hydrate(FormActionsHydrationProbe, { target: container, recover: false });
		await tick();

		expect(container.querySelector('[data-testid="form-actions-hydration-probe"]')).toBe(serverRoot);
		expect(container.querySelector('.giu-form-actions')).toBe(serverActions);
		expect(container.querySelector('[data-testid="hydrated-action"]')).toBe(serverButton);
		expect(container.querySelector('a')).toBe(serverLink);
		expect(container.querySelector('input')).toBe(serverInput);
		expect(container.querySelector('form')).toBe(serverForm);
		expect(serverRoot).toHaveAttribute('data-action-count', '0');
		expect(serverRoot).toHaveAttribute('data-key-count', '0');
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();

		serverButton.focus();
		serverButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		await vi.waitFor(() => expect(serverRoot).toHaveAttribute('data-key-count', '1'));
		expect(document.activeElement).toBe(serverButton);

		serverButton.click();
		await vi.waitFor(() => expect(serverRoot).toHaveAttribute('data-action-count', '1'));
		expect(serverRoot).toHaveAttribute('data-align', 'space-between');
		expect(serverRoot).toHaveAttribute('data-wrap', 'false');
		expect(serverActions).toHaveClass(
			'giu-form-actions--align-space-between',
			'giu-form-actions--nowrap'
		);
		expect(container.querySelector('[data-testid="hydrated-action"]')).toBe(serverButton);
		expect(container.querySelector('a')).toBe(serverLink);
		expect(container.querySelector('input')).toBe(serverInput);
		expect(container.querySelector('form')).toBe(serverForm);
		expect(document.activeElement).toBe(serverButton);
	} finally {
		if (component) await unmount(component);
		warn.mockRestore();
		error.mockRestore();
		container.remove();
	}
});
