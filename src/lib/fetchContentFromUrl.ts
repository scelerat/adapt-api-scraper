import puppeteer from "puppeteer";
export async function fetchContentFromUrl(url: string, selector: string): Promise<{}> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(true);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });
  // page.on('console', consoleObj => console.log(consoleObj.text()));
  const data = await page.evaluate((sel) => {

    return Array.from(document.querySelectorAll(sel))
              .map(element => element.innerHTML || '');
  }, selector);

  await browser.close();
  return data;
}
