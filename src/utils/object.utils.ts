// TODO refactor
export function pick<T>(obj: any, picks: (string | number)[]): T {
	const picked: Record<string, unknown> = {};
	picks.forEach((pick) => {
		picked[pick] = obj[pick];
	});
	return picked as T;
}

// Object.keys but returns (keyof T)[] instead of string[]

export const objectKeys = Object.keys as <T>(o: T) => Extract<keyof T, string | number>[];

// Object.entries but returns [keyof T, Value][] instead of [string, Value][]
export function objectEntries<TKey extends PropertyKey, TValue>(
	object: Record<TKey, TValue>
): Array<[TKey, TValue]> {
	return Object.entries(object) as Array<[TKey, TValue]>;
}

// Object.values
export const objectValues = Object.values;

export function objectFromEntries<TKey extends PropertyKey, TValue>(
	entries: Array<[TKey, TValue]>
): Record<TKey, TValue> {
	return Object.fromEntries(entries) as Record<TKey, TValue>;
}

export function objectMap<TKey extends PropertyKey, TValue, TMappedValue>(
	record: Record<TKey, TValue>,
	mapFn: (entry: [key: TKey, value: TValue]) => TMappedValue
): Record<TKey, TMappedValue> {
	return objectFromEntries(objectEntries(record).map(([key, value]) => [key, mapFn([key, value])]));
}
