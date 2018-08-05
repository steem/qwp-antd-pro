import puppeteer from 'puppeteer';
import { constants } from 'perf_hooks';

describe('Login', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8000/#/passport/login', { waitUntil: 'networkidle2' });
    await page.evaluate(() => window.localStorage.setItem('antd-pro-authority', 'guest'));
  });

  afterEach(() => page.close());

  it('should login with failure', async () => {
    await page.waitForSelector('#user');
    await page.type('#user', 'mockuser');
    await page.type('#pwd', 'wrong_password');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.has-error'); // should display error
  });

  it('should login successfully', async () => {
    await page.waitForSelector('#user');
    await page.type('#user', 'admin');
    await page.type('#pwd', '123Qwe');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-layout-sider-children > div > a'); // should display error
    const text = await page.evaluate(() => document.querySelector('.ant-layout-sider-children > div > a').innerHTML);
    expect(text).toContain('QWP - AntD');
  });

  afterAll(() => browser.close());
});
