export type ImageAttachmentIntent =
	| 'keep'
	| 'replace'
	| 'remove';

export type ImageAttachmentState =
	| { intent: 'keep'; file: null }
	| { intent: 'replace'; file: File }
	| { intent: 'remove'; file: null };

export type ImageAttachmentCurrentImage = {
	src: string;
	alt: string;
	name?: string;
};

export type ImageAttachmentValidationError = {
	code: 'invalid-type' | 'too-large' | 'custom';
	message: string;
};

export type ImageAttachmentFileValidator = (
	file: File
) => ImageAttachmentValidationError | null;

const KEEP_STATE: ImageAttachmentState = {
	intent: 'keep',
	file: null
};

function isNativeFile(value: unknown): value is File {
	return typeof File !== 'undefined' && value instanceof File;
}

function hasCurrentImage(
	currentImage: ImageAttachmentCurrentImage | null | undefined
): currentImage is ImageAttachmentCurrentImage {
	return currentImage !== null && currentImage !== undefined;
}

export function createImageAttachmentState(): ImageAttachmentState {
	return { ...KEEP_STATE };
}

export function selectImageAttachmentFile(
	state: ImageAttachmentState,
	file: File,
	disabled = false
): ImageAttachmentState {
	return disabled || !isNativeFile(file)
		? state
		: { intent: 'replace', file };
}

export function cancelImageAttachmentReplacement(
	state: ImageAttachmentState,
	disabled = false
): ImageAttachmentState {
	return disabled || state.intent !== 'replace'
		? state
		: createImageAttachmentState();
}

export function chooseImageAttachmentRemoval(
	state: ImageAttachmentState,
	currentImage: ImageAttachmentCurrentImage | null | undefined,
	disabled = false
): ImageAttachmentState {
	if (disabled || !hasCurrentImage(currentImage) || state.intent === 'remove') {
		return state;
	}

	return { intent: 'remove', file: null };
}

export function cancelImageAttachmentRemoval(
	state: ImageAttachmentState,
	disabled = false
): ImageAttachmentState {
	return disabled || state.intent !== 'remove'
		? state
		: createImageAttachmentState();
}

export function normalizeImageAttachmentState(
	state: unknown,
	currentImage: ImageAttachmentCurrentImage | null | undefined
): ImageAttachmentState {
	if (typeof state !== 'object' || state === null) {
		return createImageAttachmentState();
	}

	const candidate = state as {
		intent?: unknown;
		file?: unknown;
	};

	if (candidate.intent === 'replace' && isNativeFile(candidate.file)) {
		return { intent: 'replace', file: candidate.file };
	}

	if (candidate.intent === 'remove' && hasCurrentImage(currentImage)) {
		return { intent: 'remove', file: null };
	}

	return createImageAttachmentState();
}

const MIME_TYPE_PATTERN = /^[a-z0-9!#$%&'*+.^_`|~-]+\/[a-z0-9!#$%&'*+.^_`|~-]+$/i;

function getAcceptEntries(accept: string | undefined): string[] {
	if (accept === undefined || accept.trim() === '') {
		return [];
	}

	return accept
		.split(',')
		.map((entry) => entry.trim().toLowerCase())
		.filter((entry) => MIME_TYPE_PATTERN.test(entry)
			|| (entry.startsWith('.') && entry.length > 1));
}

function matchesAcceptEntry(file: File, entry: string): boolean {
	if (entry.startsWith('.')) {
		return file.name.toLowerCase().endsWith(entry);
	}

	const fileType = file.type.toLowerCase();

	if (entry === 'audio/*' || entry === 'video/*' || entry === 'image/*') {
		return fileType.startsWith(`${entry.slice(0, -1)}`);
	}

	return fileType === entry;
}

export function validateImageAttachmentFile(
	file: File,
	options: {
		accept?: string;
		maxSizeBytes?: number;
		validator?: ImageAttachmentFileValidator;
		messages: {
			invalidType: string;
			tooLarge: string;
		};
	}
): ImageAttachmentValidationError | null {
	const acceptEntries = getAcceptEntries(options.accept);

	if (acceptEntries.length > 0
		&& !acceptEntries.some((entry) => matchesAcceptEntry(file, entry))) {
		return {
			code: 'invalid-type',
			message: options.messages.invalidType
		};
	}

	if (Number.isFinite(options.maxSizeBytes)
		&& (options.maxSizeBytes ?? 0) > 0
		&& file.size > (options.maxSizeBytes as number)) {
		return {
			code: 'too-large',
			message: options.messages.tooLarge
		};
	}

	return options.validator?.(file) ?? null;
}
