import { wordList } from './wordList.hm';

export async function validateHM(codename: string): Promise<boolean> {
	const cleanedSearchWord = codename
		.trim()
		.replaceAll('ä', 'ae')
		.replaceAll('ö', 'oe')
		.replaceAll('ü', 'ue')
		.replaceAll('ß', 'ss');

	return !!wordList[cleanedSearchWord];
}
