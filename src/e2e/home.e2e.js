import puppeteer from 'puppeteer';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.ant-avatar');
    await page.screenshot({path: 'example.png'});
    const text = await page.evaluate(() => document.querySelector('.ant-layout-header a').innerHTML);
    expect(text).toContain('QWP - AntD');
    await page.close();
    browser.close();
  });
});
