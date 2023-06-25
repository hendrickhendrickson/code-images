import { validateWikipedia } from '../wikipedia.validation';
import { validateBlacklist } from './blacklist/blacklist.validation';
// import { validateDuden } from './duden/duden.validation';
import { validateHM } from './hm/hm.validation';

export async function validateCodenameDE(codename: string): Promise<boolean> {
	return (
		(await validateBlacklist(codename)) &&
		((await validateHM(codename)) || (await validateWikipedia(codename, 'DE')))
		// await validateDuden(codename)
	);
}
