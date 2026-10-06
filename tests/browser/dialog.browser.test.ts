import axe from 'axe-core';
import { tick } from 'svelte';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import DialogProbe from '../fixtures/DialogProbe.svelte';

const focusCases = [
	{
		name: 'autofocus descendant',
		focusMode: 'autofocus',
		expectedTestId: 'autofocus-target'
	},
	{
		name: 'static tabindex -1 autofocus descendant',
		focusMode: 'autofocus-static',
		expectedTestId: 'static-autofocus-target'
	},
	{
		name: 'first ordinary focusable descendant',
		focusMode: 'ordinary',
		expectedTestId: 'ordinary-first'
	},
	{
		name: 'native dialog fallback',
		focusMode: 'empty',
		expectedTestId: 'dialog-probe-dialog'
	}
] as const;

function dispatchDialogClick(
	target: Element,
	clientX = 0,
	clientY = 0
) {
	target.dispatchEvent(new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		clientX,
		clientY
	}));
}

test.each(focusCases)(
	'opens as a native modal and focuses the $name',
	async ({ focusMode, expectedTestId }) => {
		const screen = await render(DialogProbe, { focusMode });

		try {
			const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
			const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;
			const expectedTarget = screen.getByTestId(expectedTestId).element();

			trigger.focus();
			trigger.click();

			await vi.waitFor(() => expect(dialog.open).toBe(true));
			expect(screen.getByRole('dialog', { name: 'Dialog probe' }).element()).toBe(dialog);
			expect(dialog).toHaveAttribute('aria-label', 'Dialog probe');
			await vi.waitFor(() => expect(document.activeElement).toBe(expectedTarget));
		} finally {
			await screen.unmount();
		}
	}
);

test('ignores a stale native close event after the controlled dialog has reopened', async () => {
	const screen = await render(DialogProbe, {
		focusMode: 'ordinary'
	});

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId(
			'dialog-open-trigger'
		).element() as HTMLButtonElement;
		const dialog = screen.getByTestId(
			'dialog-probe-dialog'
		).element() as HTMLDialogElement;
		const cycle = screen.getByTestId(
			'dialog-close-reopen'
		);

		trigger.focus();
		trigger.click();

		await vi.waitFor(() =>
			expect(dialog.open).toBe(true)
		);

		await cycle.click();

		await vi.waitFor(() => {
			expect(root).toHaveAttribute(
				'data-close-callbacks',
				'1'
			);
			expect(root).toHaveAttribute(
				'data-open',
				'true'
			);
			expect(root).toHaveAttribute(
				'data-requests',
				'0'
			);
			expect(dialog.open).toBe(true);
		});

		await vi.waitFor(() =>
			expect(document.activeElement).toBe(
				screen.getByTestId(
					'ordinary-first'
				).element()
			)
		);
	} finally {
		await screen.unmount();
	}
});

test('returns focus to the connected trigger after an accepted controlled close', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		dispatchDialogClick(dialog);

		await vi.waitFor(() => {
			expect(dialog.open).toBe(false);
			expect(root).toHaveAttribute('data-open', 'false');
		});
		await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
	} finally {
		await screen.unmount();
	}
});

test('does not force a fallback focus target when the original trigger is disconnected', async () => {
	const screen = await render(DialogProbe, {
		focusMode: 'ordinary',
		disconnectTriggerOnClose: true
	});

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const fallback = screen.getByTestId('fallback-candidate').element() as HTMLButtonElement;
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		dispatchDialogClick(dialog);

		await vi.waitFor(() => {
			expect(dialog.open).toBe(false);
			expect(root).toHaveAttribute('data-open', 'false');
			expect(root).toHaveAttribute('data-trigger-rendered', 'false');
		});
		expect(document.activeElement).not.toBe(fallback);
		expect(document.body.contains(trigger)).toBe(false);
	} finally {
		await screen.unmount();
	}
});

test('prevents rejected Escape closes and composes cancel and close callbacks', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const reject = screen.getByTestId('dialog-reject-next-close');
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		await reject.click();
		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-requests', '1');
			expect(root).toHaveAttribute('data-cancel-callbacks', '1');
		});
		expect(root).toHaveAttribute('data-last-cancel-default-prevented', 'true');
		expect(root).toHaveAttribute('data-open', 'true');
		expect(dialog.open).toBe(true);
		expect(dialog.contains(document.activeElement) || document.activeElement === dialog).toBe(true);

		await userEvent.keyboard('{Escape}');

		await vi.waitFor(() => {
			expect(dialog.open).toBe(false);
			expect(root).toHaveAttribute('data-open', 'false');
			expect(root).toHaveAttribute('data-requests', '2');
			expect(root).toHaveAttribute('data-cancel-callbacks', '2');
			expect(root).toHaveAttribute('data-close-callbacks', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('requests close from the backdrop target while leaving content clicks to the consumer', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const reject = screen.getByTestId('dialog-reject-next-close');
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;
		const content = screen.getByTestId('dialog-content').element();

		await reject.click();
		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		dispatchDialogClick(content);
		await tick();

		expect(root).toHaveAttribute('data-requests', '0');
		expect(root).toHaveAttribute('data-click-callbacks', '1');
		expect(root).toHaveAttribute('data-content-clicks', '1');
		expect(root).toHaveAttribute('data-last-click-target', 'dialog-content');
		expect(dialog.open).toBe(true);

		dispatchDialogClick(dialog);

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-requests', '1');
			expect(root).toHaveAttribute('data-click-callbacks', '2');
			expect(root).toHaveAttribute('data-open', 'true');
		});
		expect(dialog.open).toBe(true);
	} finally {
		await screen.unmount();
	}
});

test('dialog-owned interior geometry is not treated as backdrop', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		trigger.focus();
		trigger.click();

		await vi.waitFor(() =>
			expect(dialog.open).toBe(true)
		);

		const rect = dialog.getBoundingClientRect();

		dispatchDialogClick(
			dialog,
			rect.left + rect.width / 2,
			rect.top + rect.height / 2
		);

		await tick();

		expect(root).toHaveAttribute(
			'data-requests',
			'0'
		);
		expect(root).toHaveAttribute(
			'data-open',
			'true'
		);
		expect(dialog.open).toBe(true);
	} finally {
		await screen.unmount();
	}
});

test('reopens after a rejected unexpected native close without repeated requests', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const reject = screen.getByTestId('dialog-reject-next-close');
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		await reject.click();
		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		dialog.close();

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-requests', '1');
			expect(root).toHaveAttribute('data-close-callbacks', '1');
		});
		await vi.waitFor(() => expect(dialog.open).toBe(true));
		await vi.waitFor(() =>
			expect(dialog.contains(document.activeElement) || document.activeElement === dialog).toBe(true)
		);

		await tick();
		await tick();

		expect(root).toHaveAttribute('data-requests', '1');
		expect(root).toHaveAttribute('data-open', 'true');
	} finally {
		await screen.unmount();
	}
});

test('accepts an unexpected native close into controlled closed state', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const root = screen.getByTestId('dialog-probe-root');
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		dialog.close();

		await vi.waitFor(() => {
			expect(dialog.open).toBe(false);
			expect(root).toHaveAttribute('data-open', 'false');
			expect(root).toHaveAttribute('data-requests', '1');
			expect(root).toHaveAttribute('data-close-callbacks', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('has no axe violations for the consumer-named open dialog', async () => {
	const screen = await render(DialogProbe, { focusMode: 'ordinary' });

	try {
		const trigger = screen.getByTestId('dialog-open-trigger').element() as HTMLButtonElement;
		const dialog = screen.getByTestId('dialog-probe-dialog').element() as HTMLDialogElement;

		trigger.focus();
		trigger.click();

		await vi.waitFor(() => expect(dialog.open).toBe(true));
		expect((await axe.run(dialog)).violations).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
