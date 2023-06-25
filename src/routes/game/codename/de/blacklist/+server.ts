import { error } from '@sveltejs/kit';
import { validateBlacklist } from './blacklist.validation.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const codename = url.searchParams.get('codename');
	if (!codename) {
		throw error(400, 'request must contain codename');
	}

	return new Response(String(await validateBlacklist(codename)));
}
