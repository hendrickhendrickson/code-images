import type { CodenameValidation } from '../../game.interface';
import { validateWikipedia } from '../wikipedia.validation';
import { validateDuden } from './duden/duden.validation';
import { validateHM } from './hm/duden.validation';

export async function validateCodenameDE(codename: string): Promise<CodenameValidation['DE']> {
	return {
		wikipedia: await validateWikipedia(codename, 'DE'),
		duden: await validateDuden(codename),
		hm: await validateHM(codename)
	};
}
