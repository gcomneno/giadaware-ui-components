import { describe, expect, test, vi } from 'vitest';

import {
	cancelImageAttachmentRemoval,
	cancelImageAttachmentReplacement,
	chooseImageAttachmentRemoval,
	createImageAttachmentState,
	normalizeImageAttachmentState,
	selectImageAttachmentFile,
	validateImageAttachmentFile
} from '../../src/lib/studio/image-attachment-control.js';

import type {
	ImageAttachmentCurrentImage,
	ImageAttachmentFileValidator,
	ImageAttachmentIntent,
	ImageAttachmentState,
	ImageAttachmentValidationError
} from '../../src/lib/studio/image-attachment-control.js';

const currentImage: ImageAttachmentCurrentImage = {
	src: '/current.png',
	alt: 'Current image',
	name: 'current.png'
};

function createFile(
	name = 'photo.png',
	type = 'image/png',
	size = 100
): File {
	return new File([new Uint8Array(size)], name, { type });
}

const messages = {
	invalidType: 'Unsupported file type',
	tooLarge: 'File is too large'
};

describe('ImageAttachment state machine', () => {
	test('exposes exactly the keep, replace and remove intents', () => {
		const intents = [
			'keep',
			'replace',
			'remove'
		] satisfies ImageAttachmentIntent[];
		const exhaustive: Record<ImageAttachmentIntent, true> = {
			keep: true,
			replace: true,
			remove: true
		};

		expect(intents).toEqual(Object.keys(exhaustive));
	});

	test('starts in keep with no file', () => {
		expect(createImageAttachmentState()).toEqual({
			intent: 'keep',
			file: null
		});
	});

	const file = createFile();
	const states: ImageAttachmentState[] = [
		{ intent: 'keep', file: null },
		{ intent: 'replace', file: createFile('old.png') },
		{ intent: 'remove', file: null }
	];

	test.each(states)(
		'selects a replacement from $intent',
		(state) => {
			expect(selectImageAttachmentFile(state, file)).toEqual({
				intent: 'replace',
				file
			});
		}
	);

	test('cancels a replacement to keep', () => {
		expect(cancelImageAttachmentReplacement(states[1])).toEqual({
			intent: 'keep',
			file: null
		});
	});

	test.each([states[0], states[2]])(
		'invalid replacement cancellation from $intent preserves identity',
		(state) => {
			expect(cancelImageAttachmentReplacement(state)).toBe(state);
		}
	);

	test.each([states[0], states[1]])(
		'chooses removal from $intent when a current image exists', (state) => {
			expect(chooseImageAttachmentRemoval(state, currentImage)).toEqual({
				intent: 'remove',
				file: null
			});
		}
	);

	test.each(states)(
		'choosing removal from $intent without a current image preserves identity',
		(state) => {
			expect(chooseImageAttachmentRemoval(state, null)).toBe(state);
		}
	);

	test('choosing removal from remove preserves identity', () => {
		expect(chooseImageAttachmentRemoval(states[2], currentImage)).toBe(states[2]);
	});

	test('cancels removal to keep', () => {
		expect(cancelImageAttachmentRemoval(states[2])).toEqual({
			intent: 'keep',
			file: null
		});
	});

	test.each([states[0], states[1]])(
		'invalid removal cancellation from $intent preserves identity', (state) => {
			expect(cancelImageAttachmentRemoval(state)).toBe(state);
		}
	);

	test('rejects malformed runtime file selection by identity', () => {
		const state = states[1];
		const malformed = { name: 'fake.png', type: 'image/png', size: 10 };

		expect(selectImageAttachmentFile(
			state,
			malformed as unknown as File
		)).toBe(state);
	});

	test.each(states)(
		'disabled transitions are no-ops from $intent',
		(state) => {
			expect(selectImageAttachmentFile(state, file, true)).toBe(state);
			expect(cancelImageAttachmentReplacement(state, true)).toBe(state);
			expect(chooseImageAttachmentRemoval(state, currentImage, true)).toBe(state);
			expect(cancelImageAttachmentRemoval(state, true)).toBe(state);
		}
	);

	test('normalizes removal to keep after the current image disappears', () => {
		expect(normalizeImageAttachmentState(
			{ intent: 'remove', file: null },
			null
		)).toEqual({ intent: 'keep', file: null });
	});

	test('preserves replacement when the current image changes or disappears', () => {
		const replacement = createFile('replacement.webp', 'image/webp');
		const state = { intent: 'replace', file: replacement } as const;

		expect(normalizeImageAttachmentState(state, currentImage)).toEqual(state);
		expect(normalizeImageAttachmentState(state, {
			src: '/other.png',
			alt: 'Other image'
		})).toEqual(state);
		expect(normalizeImageAttachmentState(state, undefined)).toEqual(state);
	});

	test('rejects plain metadata objects that mimic File fields', () => {
		const metadata = { name: 'fake.png', type: 'image/png', size: 100 };

		expect(normalizeImageAttachmentState(
			{ intent: 'replace', file: metadata },
			currentImage
		)).toEqual({ intent: 'keep', file: null });
	});

	test('normalizes a real File replacement', () => {
		const replacement = createFile('real.png', 'image/png', 37);

		expect(normalizeImageAttachmentState(
			{ intent: 'replace', file: replacement },
			currentImage
		)).toEqual({ intent: 'replace', file: replacement });
	});

	test('preserves keep and valid removal', () => {
		expect(normalizeImageAttachmentState(
			{ intent: 'keep', file: null },
			currentImage
		)).toEqual({ intent: 'keep', file: null });
		expect(normalizeImageAttachmentState(
			{ intent: 'remove', file: null },
			currentImage
		)).toEqual({ intent: 'remove', file: null });
	});

	test.each([
		null,
		undefined,
		{},
		{ intent: 'unknown', file },
		{ intent: 'replace', file: null },
		{ intent: 'replace', file: {} },
		{ intent: 'keep', file },
		{ intent: 'remove', file }
	])('normalizes malformed runtime state %j', (state) => {
		const normalized = normalizeImageAttachmentState(state, currentImage);

		expect(normalized.file === null).toBe(normalized.intent !== 'replace');
		if (normalized.intent === 'remove') {
			expect(normalized.file).toBeNull();
		}
	});

	test('cannot represent replacement and removal at the same time', () => {
		const malformed = { intent: 'remove', file };
		const normalized = normalizeImageAttachmentState(malformed, currentImage);

		expect(normalized).toEqual({ intent: 'remove', file: null });
		expect(normalized.intent === 'replace').toBe(false);
	});

	test('does not mutate caller-owned states or files', () => {
		const ownedFile = createFile();
		const ownedState: ImageAttachmentState = {
			intent: 'replace',
			file: ownedFile
		};
		const stateSnapshot = { ...ownedState };
		const fileSnapshot = {
			name: ownedFile.name,
			type: ownedFile.type,
			size: ownedFile.size,
			lastModified: ownedFile.lastModified
		};

		selectImageAttachmentFile(ownedState, ownedFile);
		cancelImageAttachmentReplacement(ownedState);
		chooseImageAttachmentRemoval(ownedState, currentImage);
		cancelImageAttachmentRemoval(ownedState);
		normalizeImageAttachmentState(ownedState, currentImage);

		expect(ownedState).toEqual(stateSnapshot);
		expect({
			name: ownedFile.name,
			type: ownedFile.type,
			size: ownedFile.size,
			lastModified: ownedFile.lastModified
		}).toEqual(fileSnapshot);
	});
});

describe('ImageAttachment file validation', () => {
	test.each([
		['image/png', createFile('photo.bin', 'image/png')],
		[' IMAGE/PNG ', createFile('photo.bin', 'image/png')]
	])('matches exact MIME accept value %s', (accept, file) => {
		expect(validateImageAttachmentFile(file, { accept, messages })).toBeNull();
	});

	test('rejects a non-matching exact MIME type', () => {
		expect(validateImageAttachmentFile(
			createFile('photo.jpg', 'image/jpeg'),
			{ accept: 'image/png', messages }
		)).toEqual({ code: 'invalid-type', message: messages.invalidType });
	});

	test('matches MIME wildcards', () => {
		expect(validateImageAttachmentFile(
			createFile('photo.webp', 'image/webp'),
			{ accept: 'image/*', messages }
		)).toBeNull();
	});

	test.each([
		'x%token/x%token',
		"x'token/x'token",
		'x`token/x`token',
		'x|token/x|token',
		'x~token/x~token'
	])('accepts HTTP token characters in MIME values: %s', (type) => {
		expect(validateImageAttachmentFile(
			createFile('data.bin', type),
			{ accept: type, messages }
		)).toBeNull();
	});

	test.each(['audio', 'video', 'image'])(
		'applies the approved %s wildcard', (topLevelType) => {
			expect(validateImageAttachmentFile(
				createFile('media.bin', `${topLevelType}/example`),
				{ accept: `${topLevelType}/*`, messages }
			)).toBeNull();
		}
	);

	test('treats other syntactically valid star MIME values as exact', () => {
		expect(validateImageAttachmentFile(
			createFile('data.bin', 'application/json'),
			{ accept: 'application/*', messages }
		)).toEqual({ code: 'invalid-type', message: messages.invalidType });
		expect(validateImageAttachmentFile(
			createFile('data.bin', 'application/*'),
			{ accept: 'application/*', messages }
		)).toBeNull();
		expect(validateImageAttachmentFile(
			createFile('data.bin', 'image/png'),
			{ accept: 'image/**', messages }
		)).toEqual({ code: 'invalid-type', message: messages.invalidType });
	});

	test.each([
		['.png', 'photo.png'],
		['.PNG', 'photo.png'],
		['.png', 'PHOTO.PNG']
	])('matches extension %s against %s case-insensitively', (accept, name) => {
		expect(validateImageAttachmentFile(
			createFile(name, ''),
			{ accept, messages }
		)).toBeNull();
	});

	test('matches any valid comma-separated accept entry', () => {
		expect(validateImageAttachmentFile(
			createFile('photo.webp', 'image/webp'),
			{ accept: ' image/png, .jpg, image/* ', messages }
		)).toBeNull();
	});

	test.each([undefined, '', '  ', ',,', 'bad', 'image', '.', 'image/png;level=1'])
		('treats empty or wholly malformed accept %j as unrestricted', (accept) => {
			expect(validateImageAttachmentFile(
				createFile('data.bin', ''),
				{ accept, messages }
			)).toBeNull();
		});

	test('ignores malformed entries alongside valid restrictions', () => {
		expect(validateImageAttachmentFile(
			createFile('data.bin', 'application/octet-stream'),
				{ accept: ', bad, image/png, image/png;level=1,', messages }
		)).toEqual({ code: 'invalid-type', message: messages.invalidType });
	});

	test('rejects an empty MIME type unless an extension matches', () => {
		const file = createFile('photo.png', '');

		expect(validateImageAttachmentFile(file, {
			accept: 'image/*',
			messages
		})).toEqual({ code: 'invalid-type', message: messages.invalidType });
		expect(validateImageAttachmentFile(file, {
			accept: 'image/*, .png',
			messages
		})).toBeNull();
	});

	test('enforces a positive finite inclusive size limit', () => {
		expect(validateImageAttachmentFile(createFile('a.png', 'image/png', 100), {
			maxSizeBytes: 100,
			messages
		})).toBeNull();
		expect(validateImageAttachmentFile(createFile('a.png', 'image/png', 101), {
			maxSizeBytes: 100,
			messages
		})).toEqual({ code: 'too-large', message: messages.tooLarge });
	});

	test.each([undefined, 0, -1, Number.NaN, Infinity, -Infinity])
		('ignores invalid size constraint %j', (maxSizeBytes) => {
			expect(validateImageAttachmentFile(
				createFile('large.bin', '', 101),
				{ maxSizeBytes, messages }
			)).toBeNull();
		});

	test('validates type before size and built-ins before custom validation', () => {
		const validator = vi.fn<ImageAttachmentFileValidator>(() => ({
			code: 'custom',
			message: 'Custom failure'
		}));
		const file = createFile('large.jpg', 'image/jpeg', 200);

		expect(validateImageAttachmentFile(file, {
			accept: 'image/png',
			maxSizeBytes: 100,
			validator,
			messages
		})).toEqual({ code: 'invalid-type', message: messages.invalidType });
		expect(validator).not.toHaveBeenCalled();

		expect(validateImageAttachmentFile(file, {
			accept: 'image/jpeg',
			maxSizeBytes: 100,
			validator,
			messages
		})).toEqual({ code: 'too-large', message: messages.tooLarge });
		expect(validator).not.toHaveBeenCalled();
	});

	test('returns custom validator success and failure', () => {
		const failure: ImageAttachmentValidationError = {
			code: 'custom',
			message: 'Image dimensions are invalid'
		};
		const valid = vi.fn<ImageAttachmentFileValidator>(() => null);
		const invalid = vi.fn<ImageAttachmentFileValidator>(() => failure);
		const file = createFile();

		expect(validateImageAttachmentFile(file, {
			validator: valid,
			messages
		})).toBeNull();
		expect(validateImageAttachmentFile(file, {
			validator: invalid,
			messages
		})).toBe(failure);
		expect(valid).toHaveBeenCalledWith(file);
		expect(invalid).toHaveBeenCalledWith(file);
	});

	test('propagates custom validator exceptions', () => {
		const error = new Error('validator failed');
		const validator: ImageAttachmentFileValidator = () => {
			throw error;
		};

		expect(() => validateImageAttachmentFile(createFile(), {
			validator,
			messages
		})).toThrow(error);
	});

	test('does not mutate the validated File object', () => {
		const file = createFile();
		const snapshot = {
			name: file.name,
			type: file.type,
			size: file.size,
			lastModified: file.lastModified
		};

		validateImageAttachmentFile(file, {
			accept: 'image/*',
			maxSizeBytes: 200,
			validator: () => null,
			messages
		});

		expect({
			name: file.name,
			type: file.type,
			size: file.size,
			lastModified: file.lastModified
		}).toEqual(snapshot);
	});
});
