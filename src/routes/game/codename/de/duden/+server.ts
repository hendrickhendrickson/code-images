import { error } from '@sveltejs/kit';
import { validateDuden } from './duden.validation.js';

export async function GET({ url }) {
	const codename = url.searchParams.get('codename');
	if (!codename) {
		throw error(400, 'request must contain codename');
	}

	return new Response(String(await validateDuden(codename)));
}
