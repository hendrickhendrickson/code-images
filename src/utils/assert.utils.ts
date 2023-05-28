import { error } from './log.utils';

export function assert<T>(condition: T, message?: string): asserts condition {
	if (!condition) {
		throw new Error(`Assertion failed: ${message}`);
	}
}

export function expect<T>(condition: T, message?: string) {
	if (!condition) {
		error(`Wrong Expectation: ${message}`);
	}
}

export function assertUnreachable(error?: unknown): never {
	throw new Error(error ? `unreachable code reached: ${error}` : `unreachable code reached`);
}
