import axe from 'axe-core';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Probe from '../fixtures/RelationshipGraphProbe.svelte';

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
