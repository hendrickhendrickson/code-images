import { error } from '@sveltejs/kit';
import { validateWikipedia } from '../../wikipedia.validation.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const codename = url.searchParams.get('codename');
	if (!codename) {
		throw error(400, 'request must contain codename');
	}

	return new Response(String(await validateWikipedia(codename, 'EN')));
}
