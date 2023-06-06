import { describe, expect, it } from 'vitest';
import {
	createRange,
	rangeClampNumber,
	rangeContainsNumber,
	rangeStepDown,
	rangeStepUp
} from './rangeFunctional.utils';

describe('range with discrete value and interval (0 & 12-50)', () => {
	const range = createRange([0, { from: 12, to: 50, step: 1 }]);
	it('should return minimum', async () => {
		expect(range.min).toEqual(0);
	});

	it('should return maximum', async () => {
		expect(range.max).toEqual(50);
	});

	it('should return if range contains number', async () => {
		expect(rangeContainsNumber(range, -12)).toEqual(false);
		expect(rangeContainsNumber(range, 0)).toEqual(true);
		expect(rangeContainsNumber(range, 6)).toEqual(false);
		expect(rangeContainsNumber(range, 12)).toEqual(true);
		expect(rangeContainsNumber(range, 20)).toEqual(true);
		expect(rangeContainsNumber(range, 20.5)).toEqual(false);
		expect(rangeContainsNumber(range, 50)).toEqual(true);
		expect(rangeContainsNumber(range, 62)).toEqual(false);
	});

	it('should clamp number to range', async () => {
		expect(rangeClampNumber(range, -12)).toEqual(0);
		expect(rangeClampNumber(range, 0)).toEqual(0);
		expect(rangeClampNumber(range, 6)).toEqual(12);
		expect(rangeClampNumber(range, 12)).toEqual(12);
		expect(rangeClampNumber(range, 20)).toEqual(20);
		expect(rangeClampNumber(range, 20.5)).toEqual(21);
		expect(rangeClampNumber(range, 50)).toEqual(50);
		expect(rangeClampNumber(range, 62)).toEqual(50);
	});

	it('step up/down', async () => {
		expect(rangeStepDown(range, -12)).toEqual(0);
		expect(rangeStepUp(range, -12)).toEqual(0);

		expect(rangeStepDown(range, 0)).toEqual(0);
		expect(rangeStepUp(range, 0)).toEqual(12);

		expect(rangeStepDown(range, 6)).toEqual(0);
		expect(rangeStepUp(range, 6)).toEqual(12);

		expect(rangeStepDown(range, 12)).toEqual(0);
		expect(rangeStepUp(range, 12)).toEqual(13);

		expect(rangeStepDown(range, 20)).toEqual(19);
		expect(rangeStepUp(range, 20)).toEqual(21);

		expect(rangeStepDown(range, 50)).toEqual(49);
		expect(rangeStepUp(range, 50)).toEqual(50);

		expect(rangeStepDown(range, 55)).toEqual(50);
		expect(rangeStepUp(range, 55)).toEqual(50);
	});
});

describe('range of 2 connecting intervals with different step sizes (0-10 & 10-100)', async () => {
	const range = createRange([
		{ from: 0, to: 10, step: 1 },
		{ from: 10, to: 100, step: 10 }
	]);
	it('should return minimum', async () => {
		expect(range.min).toEqual(0);
	});

	it('should return maximum', async () => {
		expect(range.max).toEqual(100);
	});

	it('should return if range contains number', async () => {
		expect(rangeContainsNumber(range, -12)).toEqual(false);
		expect(rangeContainsNumber(range, 0)).toEqual(true);
		expect(rangeContainsNumber(range, 1)).toEqual(true);
		expect(rangeContainsNumber(range, 10)).toEqual(true);
		expect(rangeContainsNumber(range, 12)).toEqual(false);
		expect(rangeContainsNumber(range, 20)).toEqual(true);
		expect(rangeContainsNumber(range, 20.5)).toEqual(false);
		expect(rangeContainsNumber(range, 50)).toEqual(true);
		expect(rangeContainsNumber(range, 62)).toEqual(false);
		expect(rangeContainsNumber(range, 100)).toEqual(true);
		expect(rangeContainsNumber(range, 101)).toEqual(false);
		expect(rangeContainsNumber(range, 110)).toEqual(false);
	});

	it('should clamp number to range', async () => {
		expect(rangeClampNumber(range, -12)).toEqual(0);
		expect(rangeClampNumber(range, 0)).toEqual(0);
		expect(rangeClampNumber(range, 1)).toEqual(1);
		expect(rangeClampNumber(range, 10)).toEqual(10);
		expect(rangeClampNumber(range, 12)).toEqual(10);
		expect(rangeClampNumber(range, 20)).toEqual(20);
		expect(rangeClampNumber(range, 20.5)).toEqual(20);
		expect(rangeClampNumber(range, 50)).toEqual(50);
		expect(rangeClampNumber(range, 62)).toEqual(60);
		expect(rangeClampNumber(range, 100)).toEqual(100);
		expect(rangeClampNumber(range, 101)).toEqual(100);
		expect(rangeClampNumber(range, 110)).toEqual(100);
	});

	it('step up/down', async () => {
		expect(rangeStepDown(range, -12)).toEqual(0);
		expect(rangeStepUp(range, -12)).toEqual(0);

		expect(rangeStepDown(range, 0)).toEqual(0);
		expect(rangeStepUp(range, 0)).toEqual(1);

		expect(rangeStepDown(range, 6)).toEqual(5);
		expect(rangeStepUp(range, 6)).toEqual(7);

		expect(rangeStepDown(range, 10)).toEqual(9);
		expect(rangeStepUp(range, 10)).toEqual(20);

		expect(rangeStepDown(range, 12)).toEqual(10);
		expect(rangeStepUp(range, 12)).toEqual(20);

		expect(rangeStepDown(range, 20)).toEqual(10);
		expect(rangeStepUp(range, 20)).toEqual(30);

		expect(rangeStepDown(range, 50.5)).toEqual(50);
		expect(rangeStepUp(range, 50.5)).toEqual(60);

		expect(rangeStepDown(range, 100)).toEqual(90);
		expect(rangeStepUp(range, 100)).toEqual(100);

		expect(rangeStepDown(range, 110)).toEqual(100);
		expect(rangeStepUp(range, 110)).toEqual(100);
	});
});

describe('range with decimal numbers', async () => {
	const range = createRange([
		{ from: 0, to: 1, step: 0.1 },
		{ from: 2, to: 3, step: 0.025 }
	]);
	it('should return minimum', async () => {
		expect(range.min).toEqual(0);
	});

	it('should return maximum', async () => {
		expect(range.max).toEqual(3);
	});

	it('should return if range contains number', async () => {
		expect(rangeContainsNumber(range, 0.3)).toEqual(true);
		expect(rangeContainsNumber(range, 0.35)).toEqual(false);
		expect(rangeContainsNumber(range, 1)).toEqual(true);
		expect(rangeContainsNumber(range, 1.5)).toEqual(false);
		expect(rangeContainsNumber(range, 2)).toEqual(true);
		expect(rangeContainsNumber(range, 2.075)).toEqual(true);
		expect(rangeContainsNumber(range, 2.09)).toEqual(false);
	});

	it('should clamp number to range', async () => {
		expect(rangeClampNumber(range, 0.3)).toEqual(0.3);
		expect(rangeClampNumber(range, 0.35)).toEqual(0.4);
		expect(rangeClampNumber(range, 1)).toEqual(1);
		expect(rangeClampNumber(range, 1.5)).toEqual(2);
		expect(rangeClampNumber(range, 2)).toEqual(2);
		expect(rangeClampNumber(range, 2.075)).toEqual(2.075);
		expect(rangeClampNumber(range, 2.09)).toEqual(2.1);
	});

	it('step up/down', async () => {
		expect(rangeStepDown(range, 0.3)).toEqual(0.2);
		expect(rangeStepUp(range, 0.3)).toEqual(0.4);

		expect(rangeStepDown(range, 0.35)).toEqual(0.3);
		expect(rangeStepUp(range, 0.35)).toEqual(0.4);

		expect(rangeStepDown(range, 1)).toEqual(0.9);
		expect(rangeStepUp(range, 1)).toEqual(2);

		expect(rangeStepDown(range, 1.3)).toEqual(1);
		expect(rangeStepUp(range, 1.3)).toEqual(2);

		expect(rangeStepDown(range, 2)).toEqual(1);
		expect(rangeStepUp(range, 2)).toEqual(2.025);

		expect(rangeStepDown(range, 2.075)).toEqual(2.05);
		expect(rangeStepUp(range, 2.075)).toEqual(2.1);

		expect(rangeStepDown(range, 2.09)).toEqual(2.075);
		expect(rangeStepUp(range, 2.09)).toEqual(2.1);
	});
});
