import axios from 'axios';
import type { CodenameValidationLocal } from '../game.interface';

const urls = {
	EN: `https://en.wikipedia.org/w/api.php`,
	DE: `https://de.wikipedia.org/w/api.php`
};

export async function validateWikipedia(
	codename: string,
	local: CodenameValidationLocal
): Promise<boolean> {
	try {
		const response = await axios.get(urls[local], {
			params: {
				action: 'query',
				format: 'json',
				titles: codename,
				prop: 'info',
				inprop: 'url'
			}
		});

		const pages = response.data.query.pages;
		const firstPageId = Object.keys(pages)[0];
		const page = pages[firstPageId];

		return page && 'pageid' in page;
	} catch (error) {
		console.error('Error validating Wikipedia article:', error);
		return false;
	}
}
