import puppeteer, { Page, Browser } from 'puppeteer';
import path from 'path';

let browser: Browser;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: true,
    });
});

afterAll(async () => {
    await browser.close();
});

describe('HTML', () => {
    let page: Page;

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`file:${path.join(__dirname, 'index.html')}`);
    });

    it('Соответствие количества заголовков первого уровня', async () => {
        const h1Count = await page.evaluate(
            () => document.querySelectorAll('h1')?.length,
        );

        expect(h1Count).toBe(1);
    });

    it('Заголовок первого уровня содержит текст', async () => {
        const textLength = await page.evaluate(
            () => document.querySelectorAll('h1')[0]?.textContent?.length
        );

        expect(textLength).toBeGreaterThan(1);
    });

    it('Соответствие количества заголовков второго уровня', async () => {
        const h2Count = await page.evaluate(
            () => document.querySelectorAll('h2')?.length,
        );

        expect(h2Count).toBe(1);
    });

    it('Заголовок второго уровня содержит текст', async () => {
        const textLength = await page.evaluate(
            () => document.querySelectorAll('h2')[0]?.textContent?.length
        );

        expect(textLength).toBeGreaterThan(1);
    });

    it('Соответствие количества элементов списка', async () => {
        const listData = await page.evaluate(() => [
            document.querySelectorAll('ol')?.length,
            document.querySelectorAll('li')?.length,
        ]);

        expect(listData[0]).toBe(1);
        expect(listData[1]).toBe(3);
    });

    it('Соответствие количества ссылок', async () => {
        const aCount = await page.evaluate(
            () => document.querySelectorAll('li > a')?.length,
        );

        expect(aCount).toBe(3);
    });

    it('Все ссылки куда-то ведут', async () => {
        const linksData = await page.evaluate(() =>
            Array.from(document.querySelectorAll('li > a')).map(
                (item) => !!item.getAttribute('href'),
            ),
        );

        expect(linksData.every(Boolean)).toBe(true);
    });

    it('Все ссылки содержат текст', async () => {
        const linksData = await page.evaluate(() =>
            Array.from(document.querySelectorAll('li > a')).map(
                (item) => item.textContent?.length,
            ),
        );

        linksData.forEach((textLength) => {
            expect(textLength).toBeGreaterThan(0);
        });
    });
});
