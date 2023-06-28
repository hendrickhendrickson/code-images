export function getAlphabetLetter(n: number): string | null {
	if (n < 1 || n > 26) {
		return null;
	}

	const letterCode = 64 + n;
	const letter = String.fromCharCode(letterCode);

	return letter;
}
