export function array<T>(
	length: number,
	constructor: (index: number, array: Array<T>) => T
): Array<T> {
	const array: Array<T> = [];
	for (let index = 0; index < length; index++) {
		array.push(constructor(index, array));
	}
	return array;
}

export function arrayify<T>(t: T | T[] | undefined | null): T[] {
	return t ? (Array.isArray(t) ? t : [t]) : [];
}

export function deleteElement<T>(array: Array<T>, element: T): void {
	const index = array.indexOf(element);
	if (index !== -1) {
		array.splice(index, 1);
	}
}

export function scramble<T>(array: Array<T>): Array<T> {
	array
		.splice(0, array.length)
		.map((element) => array.splice(Math.floor(Math.random() * (array.length + 1)), 0, element));
	return array;
}
