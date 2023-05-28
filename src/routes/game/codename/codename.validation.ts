import { assertUnreachable } from '../../../utils/assert.utils';
import type { CodenameValidationLocal, CodenameValidation, RuleSet } from '../game.interface';
import { validateCodenameDE } from './de/codename.validation.de';
import { validateCodenameEN } from './en/codename.validation.en';

export async function validateCodename(
	codename: string,
	codenameValidation: RuleSet['codenameValidation']
): Promise<boolean | CodenameValidation[CodenameValidationLocal]> {
	if (!codenameValidation) {
		return true;
	} else if (codenameValidation === 'EN') {
		return validateCodenameEN(codename);
	} else if (codenameValidation === 'DE') {
		return validateCodenameDE(codename);
	}
	assertUnreachable(`unknown codenameValidation: ${codenameValidation}`);
}
