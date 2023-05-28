import type { CodenameValidation } from '../../game.interface';
import { validateWikipedia } from '../wikipedia.validation';
import { validateDuden } from './duden/duden.validation';

export async function validateCodenameDE(codename: string): Promise<CodenameValidation['DE']> {
	return {
		wikipedia: await validateWikipedia(codename, 'DE'),
		duden: await validateDuden(codename)
	};
}
