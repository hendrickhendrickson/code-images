import { error } from "../log/log";

export function assert<T>(
  condition: T,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function expect<T>(
  condition: T,
  message?: string
): asserts condition {
  if (!condition) {
    error(`Wrong Expectation: ${message}`);
  }
}

