import { afterEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';

import ImageAttachmentControl from '../../src/lib/studio/ImageAttachmentControl.svelte';

import type { ImageAttachmentControlLabels, ImageAttachmentState } from '../../src/lib/studio/image-attachment-control.js';

const labels: ImageAttachmentControlLabels = {
	input: 'Choose image', cancelReplacement: 'Cancel replacement', remove: 'Remove image',
	cancelRemoval: 'Cancel removal', keepExistingStatus: 'Existing image kept',
	keepEmptyStatus: 'No image selected', replaceStatus: 'Replacement selected',
	removeStatus: 'Image will be removed', replacementPreviewAlt: 'Replacement preview'
};

const currentImage = { src: '/existing.jpg', alt: 'Existing image', name: 'existing.jpg' };
const baseProps = { invalidTypeMessage: 'Wrong type', tooLargeMessage: 'Too large', labels };

function input(): HTMLInputElement { return document.querySelector('input[type=file]') as HTMLInputElement; }
function button(text: string): HTMLButtonElement | undefined {
	return [...document.querySelectorAll<HTMLButtonElement>('button')].find((element) => element.textContent === text);
}
function select(file?: File): void {
	const transfer = new DataTransfer();
	if (file) transfer.items.add(file);
	Object.defineProperty(input(), 'files', { configurable: true, value: transfer.files });
	input().dispatchEvent(new Event('change', { bubbles: true }));
}

async function expectFormFile(form: HTMLFormElement, name: string, expected: File): Promise<void> {
	const entry = new FormData(form).get(name);
	expect(entry).toBeInstanceOf(File);
	const submitted = entry as File;
	expect(submitted.name).toBe(expected.name);
	expect(submitted.type).toBe(expected.type);
	expect(submitted.size).toBe(expected.size);
	expect(await submitted.text()).toBe(await expected.text());
}

async function controlled(
	options: Record<string, unknown> = {},
	renderOptions: Parameters<typeof render>[2] = {}
) {
	let value: ImageAttachmentState = { intent: 'keep', file: null };
	const calls: ImageAttachmentState[] = [];
	let screen: Awaited<ReturnType<typeof render>>;
	const onvaluechange = (next: ImageAttachmentState) => {
		calls.push(next);
		value = next;
		void screen.rerender({ ...baseProps, ...options, value, onvaluechange });
	};
	screen = await render(
		ImageAttachmentControl,
		{ ...baseProps, ...options, value, onvaluechange },
		renderOptions
	);
	return { screen, calls, value: () => value };
}

afterEach(() => vi.restoreAllMocks());

describe('ImageAttachmentControl controlled browser behavior', () => {
	test('adds a first image and keeps it in named FormData', async () => {
		const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:first');
		const form = document.createElement('form');
		document.body.append(form);
		let harness: Awaited<ReturnType<typeof controlled>> | undefined;
		try {
			harness = await controlled({ name: 'avatar' }, { baseElement: form });
			const file = new File(['one'], 'first.png', { type: 'image/png' });
			await harness.screen.getByLabelText(labels.input).upload(file);
			await vi.waitFor(() => expect(document.querySelector('[data-intent]')).toHaveAttribute('data-intent', 'replace'));
			expect(harness.calls).toEqual([{ intent: 'replace', file }]);
			expect(create).toHaveBeenCalledTimes(1);
			await expectFormFile(form, 'avatar', file);
			expect(form.querySelectorAll('input')).toHaveLength(1);
		} finally {
			await harness?.screen.unmount();
			form.remove();
		}
	});

	test.each([
		['cancel replacement', labels.cancelReplacement, false],
		['remove from replacement', labels.remove, true]
	] as const)('rejected %s preserves the native file, FormData, and focus', async (_name, actionLabel, withCurrentImage) => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:rejected-action');
		const form = document.createElement('form');
		document.body.append(form);
		let screen: Awaited<ReturnType<typeof render>> | undefined;
		let value: ImageAttachmentState = { intent: 'keep', file: null };
		let acceptChanges = true;
		const calls: ImageAttachmentState[] = [];
		const options = { name: 'avatar', currentImage: withCurrentImage ? currentImage : null };
		const onvaluechange = (next: ImageAttachmentState) => {
			calls.push(next);
			if (!acceptChanges) return;
			value = next;
			void screen?.rerender({ ...baseProps, ...options, value, onvaluechange });
		};
		try {
			screen = await render(ImageAttachmentControl, { ...baseProps, ...options, value, onvaluechange }, { baseElement: form });
			await screen.getByLabelText(labels.input).upload(new File(['preserved contents'], 'preserved.png', { type: 'image/png' }));
			await vi.waitFor(() => expect(document.querySelector('[data-intent]')).toHaveAttribute('data-intent', 'replace'));
			const selectedFile = input().files![0];
			acceptChanges = false;
			const action = button(actionLabel)!;
			action.focus();
			action.click();
			await vi.waitFor(() => expect(calls).toHaveLength(2));
			expect(calls.slice(1)).toEqual([{ intent: withCurrentImage ? 'remove' : 'keep', file: null }]);
			expect(value).toEqual({ intent: 'replace', file: selectedFile });
			expect(document.querySelector('[data-intent]')).toHaveAttribute('data-intent', 'replace');
			expect(input().files?.[0]).toBe(selectedFile);
			await expectFormFile(form, 'avatar', selectedFile);
			expect(document.activeElement).toBe(action);
			expect(document.activeElement).not.toBe(button(labels.cancelRemoval));
		} finally {
			await screen?.unmount();
			form.remove();
		}
	});

	test('replaces a current image, then a second replacement revokes the old URL', async () => {
		const create = vi.spyOn(URL, 'createObjectURL').mockReturnValueOnce('blob:one').mockReturnValueOnce('blob:two');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const harness = await controlled({ currentImage });
		const first = new File(['1'], 'one.png', { type: 'image/png' });
		const second = new File(['2'], 'two.png', { type: 'image/png' });
		select(first);
		await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(1));
		select(second);
		await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(2));
		expect(harness.calls).toHaveLength(2);
		expect(revoke).toHaveBeenCalledWith('blob:one');
		expect(revoke.mock.calls.filter(([url]) => url === 'blob:one')).toHaveLength(1);
	});

	test('cancels replacement, clears selection, and allows same-file reselection', async () => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:same');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const harness = await controlled();
		const file = new File(['x'], 'same.png', { type: 'image/png' });
		select(file);
		await vi.waitFor(() => expect(button('Cancel replacement')).toBeTruthy());
		button('Cancel replacement')!.click();
		await vi.waitFor(() => expect(harness.value().intent).toBe('keep'));
		expect(input().value).toBe('');
		await vi.waitFor(() => expect(document.activeElement).toBe(input()));
		expect(revoke).toHaveBeenCalledWith('blob:same');
		select(file);
		await vi.waitFor(() => expect(harness.calls).toHaveLength(3));
	});

	test('removes after replacement, clears input, then selects a file from remove', async () => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:new');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const harness = await controlled({ currentImage });
		select(new File(['x'], 'new.png', { type: 'image/png' }));
		await vi.waitFor(() => expect(button('Remove image')).toBeTruthy());
		button('Remove image')!.click();
		await vi.waitFor(() => expect(harness.value().intent).toBe('remove'));
		expect(input().value).toBe('');
		await vi.waitFor(() => expect(document.activeElement).toBe(button('Cancel removal')));
		expect(revoke).toHaveBeenCalledWith('blob:new');
		const afterRemove = new File(['y'], 'after.png', { type: 'image/png' });
		select(afterRemove);
		await vi.waitFor(() => expect(harness.value()).toEqual({ intent: 'replace', file: afterRemove }));
	});

	test('cancels removal and returns focus to the input', async () => {
		const harness = await controlled({ currentImage });
		button('Remove image')!.click();
		await vi.waitFor(() => expect(button('Cancel removal')).toBeTruthy());
		button('Cancel removal')!.click();
		await vi.waitFor(() => expect(harness.value().intent).toBe('keep'));
		await vi.waitFor(() => expect(document.activeElement).toBe(input()));
		expect(harness.calls).toHaveLength(2);
	});

	test('picker cancellation emits nothing and clears a stale error', async () => {
		const harness = await controlled({ accept: '.png' });
		select(new File(['x'], 'wrong.txt', { type: 'text/plain' }));
		await vi.waitFor(() => expect(document.querySelector('[role=alert]')).toHaveTextContent('Wrong type'));
		select();
		expect(harness.calls).toHaveLength(0);
		await vi.waitFor(() => expect(document.querySelector('[role=alert]')).toBeNull());
	});

	test.each([
		['invalid type', { accept: '.png' }, new File(['x'], 'x.txt', { type: 'text/plain' }), 'Wrong type'],
		['excessive size', { maxSizeBytes: 1 }, new File(['xx'], 'x.png', { type: 'image/png' }), 'Too large'],
		['custom failure', { validator: () => ({ code: 'custom' as const, message: 'Custom failure' }) }, new File(['x'], 'x.png', { type: 'image/png' }), 'Custom failure']
	])('%s preserves controlled state', async (_name, options, file, message) => {
		const harness = await controlled(options);
		select(file);
		expect(harness.calls).toHaveLength(0);
		expect(harness.value().intent).toBe('keep');
		await vi.waitFor(() => {
			expect(input()).toHaveAttribute('aria-invalid', 'true');
			expect(document.querySelector('[role=alert]')).toHaveTextContent(message);
		});
		expect(input().value).toBe('');
		expect(document.activeElement).toBe(input());
	});

	test('a successful selection clears an earlier validation error', async () => {
		const harness = await controlled({ accept: '.png' });
		select(new File(['x'], 'bad.txt', { type: 'text/plain' }));
		const good = new File(['x'], 'good.png', { type: 'image/png' });
		select(good);
		await vi.waitFor(() => expect(harness.value().intent).toBe('replace'));
		expect(document.querySelector('[role=alert]')).toBeNull();
		expect(harness.calls).toHaveLength(1);
	});

	test('an accepted native upload leaves focus on the file input', async () => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:focused');
		const harness = await controlled();
		input().focus();
		await harness.screen.getByLabelText(labels.input).upload(new File(['x'], 'focused.png', { type: 'image/png' }));
		await vi.waitFor(() => expect(harness.value().intent).toBe('replace'));
		expect(document.activeElement).toBe(input());
	});

	test('an ordinary external prop rerender does not steal focus', async () => {
		const onvaluechange = vi.fn();
		const screen = await render(ImageAttachmentControl, { ...baseProps, class: 'before', value: { intent: 'keep', file: null }, onvaluechange });
		const outside = document.createElement('button');
		document.body.append(outside);
		try {
			outside.focus();
			await screen.rerender({ ...baseProps, class: 'after', value: { intent: 'keep', file: null }, onvaluechange });
			expect(document.activeElement).toBe(outside);
		} finally {
			outside.remove();
		}
	});

	test('a validation error survives irrelevant rerenders and clears on meaningful attachment context changes', async () => {
		const onvaluechange = vi.fn();
		const value: ImageAttachmentState = { intent: 'keep', file: null };
		const screen = await render(ImageAttachmentControl, { ...baseProps, accept: '.png', class: 'before', value, onvaluechange });
		select(new File(['x'], 'wrong.txt', { type: 'text/plain' }));
		await vi.waitFor(() => expect(document.querySelector('[role=alert]')).toHaveTextContent('Wrong type'));
		await screen.rerender({ ...baseProps, accept: '.png', class: 'after', value, onvaluechange });
		expect(document.querySelector('[role=alert]')).toHaveTextContent('Wrong type');
		await screen.rerender({ ...baseProps, accept: '.png', class: 'after', currentImage, value, onvaluechange });
		await vi.waitFor(() => expect(document.querySelector('[role=alert]')).toBeNull());
	});

	test('omits removal without a current image and disables every interaction', async () => {
		const harness = await controlled({ disabled: true });
		expect(button('Remove image')).toBeUndefined();
		expect(input()).toBeDisabled();
		select(new File(['x'], 'x.png', { type: 'image/png' }));
		expect(harness.calls).toHaveLength(0);
	});

	test('reconciles a native selection when the consumer rejects the transition', async () => {
		const onvaluechange = vi.fn();
		await render(ImageAttachmentControl, { ...baseProps, value: { intent: 'keep', file: null }, onvaluechange });
		select(new File(['x'], 'rejected.png', { type: 'image/png' }));
		await vi.waitFor(() => expect(input().value).toBe(''));
		expect(onvaluechange).toHaveBeenCalledTimes(1);
		expect(document.activeElement).not.toBe(button('Cancel replacement'));
	});

	test('normalizes remove after the current image disappears exactly once', async () => {
		const onvaluechange = vi.fn();
		const screen = await render(ImageAttachmentControl, { ...baseProps, currentImage, value: { intent: 'remove', file: null }, onvaluechange });
		await screen.rerender({ ...baseProps, currentImage: null, value: { intent: 'remove', file: null }, onvaluechange });
		await vi.waitFor(() => expect(onvaluechange).toHaveBeenCalledTimes(1));
		expect(onvaluechange).toHaveBeenCalledWith({ intent: 'keep', file: null });
		expect(document.querySelector('[data-intent]')).toHaveAttribute('data-intent', 'keep');
	});

	test('revokes on external state change and unmount without double revocation', async () => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:owned');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const file = new File(['x'], 'x.png', { type: 'image/png' });
		const screen = await render(ImageAttachmentControl, { ...baseProps, value: { intent: 'replace', file }, onvaluechange: vi.fn() });
		await vi.waitFor(() => expect(document.querySelector('img[src="blob:owned"]')).toBeTruthy());
		await screen.rerender({ ...baseProps, value: { intent: 'keep', file: null }, onvaluechange: vi.fn() });
		expect(revoke).toHaveBeenCalledTimes(1);
		await screen.unmount();
		expect(revoke).toHaveBeenCalledTimes(1);
	});

	test('revokes an owned URL on unmount', async () => {
		vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:unmount');
		const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
		const screen = await render(ImageAttachmentControl, { ...baseProps, value: { intent: 'replace', file: new File(['x'], 'x.png', { type: 'image/png' }) }, onvaluechange: vi.fn() });
		await vi.waitFor(() => expect(document.querySelector('img')).toBeTruthy());
		await screen.unmount();
		expect(revoke).toHaveBeenCalledWith('blob:unmount');
	});

	test.each(['unavailable', 'throwing'])('%s object URL creation preserves replacement text', async (mode) => {
		const original = URL.createObjectURL;
		if (mode === 'unavailable') Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: undefined });
		else vi.spyOn(URL, 'createObjectURL').mockImplementation(() => { throw new Error('no URL'); });
		try {
			await render(ImageAttachmentControl, { ...baseProps, value: { intent: 'replace', file: new File(['x'], 'visible.png', { type: 'image/png' }) }, onvaluechange: vi.fn() });
			expect(document.body).toHaveTextContent('visible.png');
			expect(document.body).toHaveTextContent('Replacement selected');
			expect(document.querySelector('.image-attachment-control__placeholder')).toBeTruthy();
		} finally { Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: original }); }
	});
});
