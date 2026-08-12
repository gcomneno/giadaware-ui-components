import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Probe from '../fixtures/RelationshipGraphProbe.svelte';
import LocalizedProbe from '../fixtures/RelationshipGraphLocalizedProbe.svelte';

test('activates nodes by pointer and keyboard and centers selection', async () => {
	const screen = await render(Probe); const root = screen.getByTestId('relationship-probe');
	await screen.getByRole('button', {name:'Beta'}).click();
	await vi.waitFor(() => expect(root).toHaveAttribute('data-selected','b')); expect(root).toHaveAttribute('data-activated','b'); expect(root).toHaveAttribute('data-source','pointer');
	const gamma = screen.getByRole('button',{name:'Gamma'}); (gamma.element() as HTMLButtonElement).focus(); await userEvent.keyboard('{Enter}');
	await vi.waitFor(() => expect(root).toHaveAttribute('data-activated','c')); expect(root).toHaveAttribute('data-source','keyboard');
	const alpha = screen.getByRole('link',{name:'Alpha'}); (alpha.element() as HTMLAnchorElement).focus(); await userEvent.keyboard('{Enter}');
	await vi.waitFor(() => expect(root).toHaveAttribute('data-activated','a')); expect(root).toHaveAttribute('data-source','keyboard');
});

test('supports controls, wheel, drag and pinch viewport changes', async () => {
	const screen = await render(Probe); const graph = document.querySelector('[data-giu-relationship-graph]') as HTMLElement; const viewport = () => graph.querySelector('[data-giu-scale]') as HTMLElement;
	await screen.getByRole('button',{name:'Zoom in'}).click(); await vi.waitFor(() => expect(Number(viewport().dataset.giuScale)).toBeGreaterThan(1));
	await screen.getByRole('button',{name:'Reset view'}).click(); expect(viewport()).toHaveAttribute('data-giu-scale','1.000');
	graph.dispatchEvent(new WheelEvent('wheel',{deltaY:-20,bubbles:true,cancelable:true})); await vi.waitFor(() => expect(Number(viewport().dataset.giuScale)).toBeGreaterThan(1));
	const before = viewport().style.transform; graph.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,clientX:10,clientY:10,bubbles:true})); graph.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,clientX:40,clientY:30,bubbles:true})); graph.dispatchEvent(new PointerEvent('pointerup',{pointerId:1,bubbles:true})); await vi.waitFor(() => expect(viewport().style.transform).not.toBe(before));
	graph.dispatchEvent(new PointerEvent('pointerdown',{pointerId:2,pointerType:'touch',clientX:10,clientY:10,bubbles:true})); graph.dispatchEvent(new PointerEvent('pointerdown',{pointerId:3,pointerType:'touch',clientX:30,clientY:10,bubbles:true})); const scale=Number(viewport().dataset.giuScale); graph.dispatchEvent(new PointerEvent('pointermove',{pointerId:3,pointerType:'touch',clientX:60,clientY:10,bubbles:true})); await vi.waitFor(() => expect(Number(viewport().dataset.giuScale)).toBeGreaterThan(scale));
	graph.dispatchEvent(new PointerEvent('pointerup',{pointerId:3,pointerType:'touch',clientX:60,clientY:10,bubbles:true})); const afterPinch=viewport().style.transform; graph.dispatchEvent(new PointerEvent('pointermove',{pointerId:2,pointerType:'touch',clientX:25,clientY:30,bubbles:true})); await vi.waitFor(() => expect(viewport().style.transform).not.toBe(afterPinch)); graph.dispatchEvent(new PointerEvent('pointerup',{pointerId:2,pointerType:'touch',bubbles:true}));
	await screen.getByRole('button',{name:'Fit graph'}).click(); expect(Number(viewport().dataset.giuScale)).toBeGreaterThanOrEqual(.25);
});

test('is accessible and remains contained at a narrow width', async () => {
	const screen = await render(Probe); const root=screen.getByTestId('relationship-probe').element() as HTMLElement; root.style.width='280px';
	expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth); expect((await axe.run(root)).violations).toHaveLength(0);
	expect(root).toHaveTextContent('Alpha to Beta: supports');
});


test('navigates spatially between nodes without activating them', async () => {
	const screen = await render(Probe);
	const root = screen.getByTestId('relationship-probe');

	const alpha = screen.getByRole('link', { name: 'Alpha' }).element() as HTMLAnchorElement;
	const beta = screen.getByRole('button', { name: 'Beta' }).element() as HTMLButtonElement;
	const gamma = screen.getByRole('button', { name: 'Gamma' }).element() as HTMLButtonElement;

	alpha.focus();
	await userEvent.keyboard('{ArrowDown}');

	await vi.waitFor(() => expect(document.activeElement).toBe(beta));
	expect(root).toHaveAttribute('data-selected', 'b');
	expect(root).toHaveAttribute('data-activated', '');

	await userEvent.keyboard('{ArrowDown}');
	await vi.waitFor(() => expect(document.activeElement).toBe(gamma));
	expect(root).toHaveAttribute('data-selected', 'c');
	expect(root).toHaveAttribute('data-activated', '');

	await userEvent.keyboard('{ArrowUp}');
	await vi.waitFor(() => expect(document.activeElement).toBe(beta));
	expect(root).toHaveAttribute('data-selected', 'b');

	await userEvent.keyboard('{ArrowLeft}');
	expect(document.activeElement).toBe(beta);
	expect(root).toHaveAttribute('data-activated', '');
});

test('pans the viewport through keyboard-operable native controls', async () => {
	const screen = await render(Probe);
	const graph = document.querySelector('[data-giu-relationship-graph]') as HTMLElement;
	const viewport = graph.querySelector('[data-giu-scale]') as HTMLElement;

	const panLeft = screen.getByRole('button', { name: 'Pan left' }).element() as HTMLButtonElement;
	panLeft.focus();
	await userEvent.keyboard('{Enter}');

	await vi.waitFor(() =>
		expect(viewport.style.transform).toContain('translate(48px, 0px)')
	);

	const panRight = screen.getByRole('button', { name: 'Pan right' }).element() as HTMLButtonElement;
	panRight.focus();
	await userEvent.keyboard('{Enter}');

	await vi.waitFor(() =>
		expect(viewport.style.transform).toContain('translate(0px, 0px)')
	);
});

test('renders consumer-owned localized graph copy without built-in English UI strings', async () => {
	const screen = await render(LocalizedProbe);
	const root = screen.getByTestId('localized-relationship-probe').element() as HTMLElement;

	expect(screen.getByRole('region', { name: 'Grafo delle relazioni' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Ingrandisci' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Riduci' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Sposta vista a sinistra' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Sposta vista in alto' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Sposta vista in basso' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Sposta vista a destra' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Reimposta vista' })).toBeDefined();
	expect(screen.getByRole('button', { name: 'Adatta grafo' })).toBeDefined();

	expect(root).toHaveTextContent('3 nodi, 3 relazioni dirette.');
	expect(root).toHaveTextContent('Alpha verso Beta: supports');
	expect(root).not.toHaveTextContent('directed relationships');

	expect(root.querySelector('[aria-label="Graph controls"]')).toBeNull();
	expect(root.querySelector('[aria-label="Zoom in"]')).toBeNull();

	expect((await axe.run(root)).violations).toHaveLength(0);
});
