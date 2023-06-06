import { assertUnreachable } from './assert.utils';

export type RangeFunctional = {
	min: number;
	stepSizes: Array<number>;
	stepCounts: Array<number>;
	max: number;
};

export function createRange(
	rangeDefinition: Array<number | { from: number; to: number; step: number }>
): RangeFunctional {
	let min = Number.POSITIVE_INFINITY;
	const stepSizes: Array<number> = [];
	const stepCounts: Array<number> = [];

	let current: number | null = null;

	rangeDefinition
		.sort(
			(entryA, entryB) =>
				(typeof entryA === 'number' ? entryA : entryA.from) -
				(typeof entryB === 'number' ? entryB : entryB.from)
		)
		.forEach((entry) => {
			if (typeof entry === 'number') {
				if (current === null) {
					min = entry;
					current = entry;
				} else {
					// TODO handle overlapping entries
					const delta = entry - current;
					stepSizes.push(delta);
					stepCounts.push(1);
					current += delta;
				}
			} else {
				if (current === null) {
					min = entry.from;
					current = entry.from;
				} else if (current !== entry.from) {
					// TODO handle overlapping entries
					const delta = entry.from - current;
					stepSizes.push(delta);
					stepCounts.push(1);
					current += delta;
				}

				const stepSize = entry.step;
				stepSizes.push(stepSize);
				const stepCount = Math.floor((entry.to - entry.from) / entry.step);
				stepCounts.push(stepCount);
				current += stepSize * stepCount;
			}
		});

	let max;
	if (current !== null) {
		max = current;
	} else {
		max = Number.NEGATIVE_INFINITY;
	}

	return {
		min,
		max,
		stepSizes,
		stepCounts
	};
}

export function rangeContainsNumber(range: RangeFunctional, n: number): boolean {
	const { min, max, stepSizes, stepCounts } = range;
	if (n < min || n > max) {
		return false;
	}

	let current = min;
	for (let stepIndex = 0; stepIndex < stepSizes.length; stepIndex++) {
		const stepSize = stepSizes[stepIndex];
		const stepCount = stepCounts[stepIndex];
		if (n <= current + stepSize * stepCount) {
			return (n - current) % stepSize === 0; // TODO might have floating point errors
		}
		current += stepSize * stepCount;
	}
	assertUnreachable();
}

export function rangeClampNumber(range: RangeFunctional, n: number): number {
	const { min, max, stepSizes, stepCounts } = range;
	if (n <= min) {
		return min;
	} else if (n >= max) {
		return max;
	}

	let current = min;
	for (let stepIndex = 0; stepIndex < stepSizes.length; stepIndex++) {
		const stepSize = stepSizes[stepIndex];
		const stepCount = stepCounts[stepIndex];
		if (n <= current + stepSize * stepCount) {
			return current + Math.round((n - current) / stepSize) * stepSize; // TODO might have floating point errors
		}
		current += stepSize * stepCount;
	}
	assertUnreachable();
}

export function rangeStepUp(range: RangeFunctional, n: number): number {
	const { min, max, stepSizes, stepCounts } = range;
	if (n < min) {
		return min;
	} else if (n >= max) {
		return max;
	}

	let current = min;
	for (let stepIndex = 0; stepIndex < stepSizes.length; stepIndex++) {
		const stepSize = stepSizes[stepIndex];
		const stepCount = stepCounts[stepIndex];
		if (n < current + stepSize * stepCount) {
			return current + (Math.floor((n - current) / stepSize) + 1) * stepSize;
		}
		current += stepSize * stepCount;
	}
	assertUnreachable();
}

export function rangeStepDown(range: RangeFunctional, n: number): number {
	const { min, max, stepSizes, stepCounts } = range;
	if (n <= min) {
		return min;
	} else if (n > max) {
		return max;
	}

	let current = min;
	for (let stepIndex = 0; stepIndex < stepSizes.length; stepIndex++) {
		const stepSize = stepSizes[stepIndex];
		const stepCount = stepCounts[stepIndex];
		if (n <= current + stepSize * stepCount) {
			return current + (Math.ceil((n - current) / stepSize) - 1) * stepSize;
		}
		current += stepSize * stepCount;
	}
	assertUnreachable();
}
