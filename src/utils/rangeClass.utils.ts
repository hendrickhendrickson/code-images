import { assertUnreachable } from './assert.utils';

export class RangeClass {
	private _min: number;
	private _stepSizes: Array<number> = [];
	private _stepCounts: Array<number> = [];
	private _max: number;

	constructor(rangeDefinition: Array<number | { from: number; to: number; step: number }>) {
		this._min = Number.POSITIVE_INFINITY;
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
						this._min = entry;
						current = entry;
					} else {
						// TODO handle overlapping entries
						const delta = entry - current;
						this._stepSizes.push(delta);
						this._stepCounts.push(1);
						current += delta;
					}
				} else {
					if (current === null) {
						this._min = entry.from;
						current = entry.from;
					} else if (current !== entry.from) {
						// TODO handle overlapping entries
						const delta = entry.from - current;
						this._stepSizes.push(delta);
						this._stepCounts.push(1);
						current += delta;
					}

					const stepSize = entry.step;
					this._stepSizes.push(stepSize);
					const stepCount = Math.floor((entry.to - entry.from) / entry.step);
					this._stepCounts.push(stepCount);
					current += stepSize * stepCount;
				}
			});

		if (current !== null) {
			this._max = current;
		} else {
			this._max = Number.NEGATIVE_INFINITY;
		}
	}

	public get min(): number {
		return this._min;
	}

	public get max(): number {
		return this._max;
	}

	public containsNumber(n: number): boolean {
		if (n < this._min || n > this._max) {
			return false;
		}

		let current = this._min;
		for (let stepIndex = 0; stepIndex < this._stepSizes.length; stepIndex++) {
			const stepSize = this._stepSizes[stepIndex];
			const stepCount = this._stepCounts[stepIndex];
			if (n <= current + stepSize * stepCount) {
				return (n - current) % stepSize === 0; // TODO might have floating point errors
			}
			current += stepSize * stepCount;
		}
		assertUnreachable();
	}

	public clampNumber(n: number): number {
		if (n <= this._min) {
			return this._min;
		} else if (n >= this._max) {
			return this._max;
		}

		let current = this._min;
		for (let stepIndex = 0; stepIndex < this._stepSizes.length; stepIndex++) {
			const stepSize = this._stepSizes[stepIndex];
			const stepCount = this._stepCounts[stepIndex];
			if (n <= current + stepSize * stepCount) {
				return current + Math.round((n - current) / stepSize) * stepSize; // TODO might have floating point errors
			}
			current += stepSize * stepCount;
		}
		assertUnreachable();
	}

	public stepUp(n: number): number {
		if (n < this._min) {
			return this._min;
		} else if (n >= this._max) {
			return this._max;
		}

		let current = this._min;
		for (let stepIndex = 0; stepIndex < this._stepSizes.length; stepIndex++) {
			const stepSize = this._stepSizes[stepIndex];
			const stepCount = this._stepCounts[stepIndex];
			if (n < current + stepSize * stepCount) {
				return current + (Math.floor((n - current) / stepSize) + 1) * stepSize;
			}
			current += stepSize * stepCount;
		}
		assertUnreachable();
	}

	public stepDown(n: number): number {
		if (n <= this._min) {
			return this._min;
		} else if (n > this._max) {
			return this._max;
		}

		let current = this._min;
		for (let stepIndex = 0; stepIndex < this._stepSizes.length; stepIndex++) {
			const stepSize = this._stepSizes[stepIndex];
			const stepCount = this._stepCounts[stepIndex];
			if (n <= current + stepSize * stepCount) {
				return current + (Math.ceil((n - current) / stepSize) - 1) * stepSize;
			}
			current += stepSize * stepCount;
		}
		assertUnreachable();
	}
}
