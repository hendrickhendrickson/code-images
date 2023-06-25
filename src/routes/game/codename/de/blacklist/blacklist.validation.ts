import { wordList } from './wordList.blacklist';

export async function validateBlacklist(codename: string): Promise<boolean> {
	const cleanedSearchWord = codename
		.trim()
		.toLowerCase()
		.replaceAll('ä', 'ae')
		.replaceAll('ö', 'oe')
		.replaceAll('ü', 'ue')
		.replaceAll('ß', 'ss');

	return wordList.every((blacklistWord) => !cleanedSearchWord.includes(blacklistWord));
}
