import puppeteer from 'puppeteer';

const url = 'https://www.duden.de/rechtschreibung';

export async function validateDuden(codename: string): Promise<boolean> {
	const browser = await puppeteer.launch({ headless: 'new' });
	const page = await browser.newPage();

	const cleanedSearchWord = codename
		.trim()
		.replaceAll('ä', 'ae')
		.replaceAll('ö', 'oe')
		.replaceAll('ü', 'ue')
		.replaceAll('ß', 'sz')
		.replaceAll(' ', '%20');

	await page.goto(`${url}/${cleanedSearchWord}`);

	await page.setViewport({ width: 1080, height: 1024 });

	try {
		const title = await page.title();
		await browser.close();
		return !(title.includes('nicht gefunden') || title.includes('not found'));
	} catch (error) {
		await browser.close();
		return false;
	}
}
