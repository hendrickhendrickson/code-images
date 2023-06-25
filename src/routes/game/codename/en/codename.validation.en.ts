import { validateWikipedia } from '../wikipedia.validation';

export async function validateCodenameEN(codename: string): Promise<boolean> {
	return await validateWikipedia(codename, 'EN');
}
