export type ImageFocalPointValue = {
	x: number;
	y: number;
};

export type ImageFocalPointImage = {
	src: string;
	alt: string;
};

export type ImageFocalPointControlProps = {
	image: ImageFocalPointImage;
	value?: ImageFocalPointValue | null;
	onvaluechange: (value: ImageFocalPointValue) => void;
	label: string;
	disabled?: boolean;
	id?: string;
	class?: string;
	style?: string;
};

type ImageFocalPointBounds = {
	left: number;
	top: number;
	width: number;
	height: number;
};

const centerCoordinate = 0.5;
const minimumCoordinate = 0;
const maximumCoordinate = 1;

function centerValue(): ImageFocalPointValue {
	return {
		x: centerCoordinate,
		y: centerCoordinate
	};
}

function clampCoordinate(value: number): number {
	return Math.min(maximumCoordinate, Math.max(minimumCoordinate, value));
}

function normalizeCoordinate(value: unknown): number {
	return typeof value === 'number' && Number.isFinite(value)
		? clampCoordinate(value)
		: centerCoordinate;
}

function normalizedAxisFromClientPoint(
	clientCoordinate: number,
	start: number,
	size: number
): number {
	if (
		!Number.isFinite(clientCoordinate) ||
		!Number.isFinite(start) ||
		!Number.isFinite(size) ||
		size <= 0
	) {
		return centerCoordinate;
	}

	return clampCoordinate((clientCoordinate - start) / size);
}

export function normalizeImageFocalPointValue(
	value: unknown
): ImageFocalPointValue {
	if (typeof value !== 'object' || value === null) {
		return centerValue();
	}

	const candidate = value as {
		x?: unknown;
		y?: unknown;
	};

	return {
		x: normalizeCoordinate(candidate.x),
		y: normalizeCoordinate(candidate.y)
	};
}

export function imageFocalPointFromClientPoint(
	clientX: number,
	clientY: number,
	bounds: ImageFocalPointBounds
): ImageFocalPointValue {
	return {
		x: normalizedAxisFromClientPoint(clientX, bounds.left, bounds.width),
		y: normalizedAxisFromClientPoint(clientY, bounds.top, bounds.height)
	};
}

export function moveImageFocalPointValue(
	value: unknown,
	delta: ImageFocalPointValue
): ImageFocalPointValue {
	const normalized = normalizeImageFocalPointValue(value);

	return normalizeImageFocalPointValue({
		x: normalized.x + delta.x,
		y: normalized.y + delta.y
	});
}
