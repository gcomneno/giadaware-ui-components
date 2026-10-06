import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

import TabsProbe from '../fixtures/TabsProbe.svelte';

test('automatic horizontal navigation moves focus, wraps and requests controlled selection', async () => {
	const screen = await render(TabsProbe, {
		activation: 'automatic'
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const overview = screen.getByTestId('tab-overview').element() as HTMLButtonElement;
		const details = screen.getByTestId('tab-details').element() as HTMLButtonElement;
		const logs = screen.getByTestId('tab-logs').element() as HTMLButtonElement;

		overview.focus();

		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() => expect(document.activeElement).toBe(details));
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'details');
			expect(root).toHaveAttribute('data-requests', '1');
		});

		await userEvent.keyboard('{End}');

		await vi.waitFor(() => expect(document.activeElement).toBe(logs));
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'logs');
			expect(root).toHaveAttribute('data-requests', '2');
		});

		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() => expect(document.activeElement).toBe(overview));
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'overview');
			expect(root).toHaveAttribute('data-requests', '3');
		});

		expect(root).toHaveAttribute('data-keydowns', '3');
	} finally {
		await screen.unmount();
	}
});

test('horizontal navigation skips disabled tabs', async () => {
	const screen = await render(TabsProbe, {
		activation: 'automatic',
		disabledDetails: true
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const overview = screen.getByTestId('tab-overview').element() as HTMLButtonElement;
		const details = screen.getByTestId('tab-details').element() as HTMLButtonElement;
		const logs = screen.getByTestId('tab-logs').element() as HTMLButtonElement;

		expect(details.disabled).toBe(true);

		overview.focus();
		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() => expect(document.activeElement).toBe(logs));
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'logs');
			expect(root).toHaveAttribute('data-requests', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('vertical orientation owns only ArrowUp and ArrowDown', async () => {
	const screen = await render(TabsProbe, {
		activation: 'automatic',
		orientation: 'vertical'
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const overview = screen.getByTestId('tab-overview').element() as HTMLButtonElement;
		const details = screen.getByTestId('tab-details').element() as HTMLButtonElement;

		overview.focus();

		await userEvent.keyboard('{ArrowRight}');

		expect(document.activeElement).toBe(overview);
		expect(root).toHaveAttribute('data-value', 'overview');
		expect(root).toHaveAttribute('data-requests', '0');

		await userEvent.keyboard('{ArrowDown}');

		await vi.waitFor(() => expect(document.activeElement).toBe(details));
		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'details');
			expect(root).toHaveAttribute('data-requests', '1');
		});

		expect(root).toHaveAttribute('data-keydowns', '2');
	} finally {
		await screen.unmount();
	}
});

test('manual navigation moves focus without selection and Enter requests selection exactly once', async () => {
	const screen = await render(TabsProbe, {
		activation: 'manual'
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const overview = screen.getByTestId('tab-overview').element() as HTMLButtonElement;
		const details = screen.getByTestId('tab-details').element() as HTMLButtonElement;

		overview.focus();
		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() => expect(document.activeElement).toBe(details));
		expect(root).toHaveAttribute('data-value', 'overview');
		expect(root).toHaveAttribute('data-requests', '0');

		await userEvent.keyboard('{Enter}');

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'details');
			expect(root).toHaveAttribute('data-requests', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('manual Space requests selection exactly once', async () => {
	const screen = await render(TabsProbe, {
		activation: 'manual'
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const logs = screen.getByTestId('tab-logs').element() as HTMLButtonElement;

		logs.focus();
		await userEvent.keyboard(' ');

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'logs');
			expect(root).toHaveAttribute('data-requests', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('click requests selection once and consumer click/focus handlers compose once', async () => {
	const screen = await render(TabsProbe, {
		activation: 'manual'
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const logs = screen.getByTestId('tab-logs');

		await logs.click();

		await vi.waitFor(() => {
			expect(root).toHaveAttribute('data-value', 'logs');
			expect(root).toHaveAttribute('data-requests', '1');
			expect(root).toHaveAttribute('data-logs-clicks', '1');
			expect(root).toHaveAttribute('data-logs-focuses', '1');
		});
	} finally {
		await screen.unmount();
	}
});

test('controlled rejection leaves visual selection authoritative to the supplied value', async () => {
	const screen = await render(TabsProbe, {
		activation: 'manual',
		rejectSelection: true
	});

	try {
		const root = screen.getByTestId('tabs-probe');
		const overview = screen.getByTestId('tab-overview').element() as HTMLButtonElement;
		const logs = screen.getByTestId('tab-logs');

		expect(overview.getAttribute('aria-selected')).toBe('true');

		await logs.click();

		await vi.waitFor(() =>
			expect(root).toHaveAttribute('data-requests', '1')
		);

		expect(root).toHaveAttribute('data-value', 'overview');
		expect(overview.getAttribute('aria-selected')).toBe('true');
		expect(logs.element()).toHaveAttribute('aria-selected', 'false');
	} finally {
		await screen.unmount();
	}
});

test('multiple Tabs instances keep keyboard navigation isolated', async () => {
	const first = await render(TabsProbe, {
		activation: 'automatic',
		id: 'first-tabs'
	});
	const second = await render(TabsProbe, {
		activation: 'automatic',
		id: 'second-tabs'
	});

	try {
		const firstRoot = document.querySelector(
			'[data-testid="tabs-probe"] [data-testid="tabs-root"][id="first-tabs"]'
		)?.parentElement;
		const secondRoot = document.querySelector(
			'[data-testid="tabs-probe"] [data-testid="tabs-root"][id="second-tabs"]'
		)?.parentElement;

		const firstOverview = document.querySelector(
			'button[data-giu-tabs-root="first-tabs"][data-giu-tab-value="overview"]'
		) as HTMLButtonElement | null;
		const firstDetails = document.querySelector(
			'button[data-giu-tabs-root="first-tabs"][data-giu-tab-value="details"]'
		) as HTMLButtonElement | null;

		expect(firstRoot).not.toBeNull();
		expect(secondRoot).not.toBeNull();
		expect(firstOverview).not.toBeNull();
		expect(firstDetails).not.toBeNull();

		if (!firstRoot || !secondRoot || !firstOverview || !firstDetails) {
			throw new TypeError('Expected both Tabs instances to be rendered.');
		}

		firstOverview.focus();
		await userEvent.keyboard('{ArrowRight}');

		await vi.waitFor(() => expect(document.activeElement).toBe(firstDetails));
		await vi.waitFor(() =>
			expect(firstRoot).toHaveAttribute('data-value', 'details')
		);
		expect(secondRoot).toHaveAttribute('data-value', 'overview');
		expect(secondRoot).toHaveAttribute('data-requests', '0');
	} finally {
		await first.unmount();
		await second.unmount();
	}
});

test('renders an accessible named tabs pattern with no axe violations', async () => {
	const screen = await render(TabsProbe);

	try {
		const root = screen.getByTestId('tabs-root').element();

		expect((await axe.run(root)).violations).toHaveLength(0);
	} finally {
		await screen.unmount();
	}
});
