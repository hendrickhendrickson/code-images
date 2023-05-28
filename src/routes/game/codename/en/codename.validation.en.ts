import type { CodenameValidation } from '../../game.interface';
import { validateWikipedia } from '../wikipedia.validation';

export async function validateCodenameEN(codename: string): Promise<CodenameValidation['EN']> {
	return {
		wikipedia: await validateWikipedia(codename, 'EN')
	};
}
