export function repeat(times: number, func: (index: number) => void): void {
	for (let index = 0; index < times; index++) {
		func(index);
	}
}
