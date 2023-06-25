import { assertUnreachable } from '../../../utils/assert.utils';
import type { RuleSet } from '../game.interface';
import { validateCodenameDE } from './de/codename.validation.de';
import { validateCodenameEN } from './en/codename.validation.en';

export async function validateCodename(
	codename: string,
	codenameValidation: RuleSet['codenameValidation']
): Promise<boolean> {
	if (!codenameValidation) {
		return true;
	} else if (codenameValidation === 'EN') {
		return validateCodenameEN(codename);
	} else if (codenameValidation === 'DE') {
		return validateCodenameDE(codename);
	}
	assertUnreachable(`unknown codenameValidation: ${codenameValidation}`);
}
