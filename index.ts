import axios from "axios";
import cheerio from "cheerio"
import puppeteer from "puppeteer";


async function fetchContentFromUrl(url: string, selector: string): Promise<string[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 5000 });

    page.on('console', consoleObj => console.log(consoleObj.text()));
    const data = await page.evaluate((sel) => {
        return Array.from(document.querySelectorAll(sel))
                    .map(element => element.textContent || '');
    }, selector);

    await browser.close();
    return data;
}


const input= [{
	"carrier": "MOCK_INDEMNITY",
	"customerId": "a0dfjw9a"
},{
  "carrier": "PLACEHOLDER_CARRIER",
	"customerId": "f02dkl4e"
}]

const strategies = {
  'MOCK_INDEMNITY': {
    baseUrl: 'https://scraping-interview.onrender.com/mock_indemnity/',
    parentSelector: '.customer-detail .card-body',
  },
  'PLACEHOLDER_CARRIER': {
    baseUrl: 'https://scraping-interview.onrender.com/placeholder_carrier/',
    parentSelector: '.customer-details .card-body',
  }
}


async function scrape() {
    // TODO: temp, remove/abstract; should get command line args or something
    const { carrier, customerId } = input[1]
    const strategy = strategies[ carrier as keyof typeof strategies]
    
  
    // TODO: check validity of input and resulting strategy

    // const { data } = await axios.get(`${strategy.baseUrl}/${customerId}`)

    // const $ = cheerio.load(data)
    // 
    // console.log($('body').html())
    console.log("start evaluating javascipt")
    fetchContentFromUrl(`${strategy.baseUrl}${customerId}`, strategy.parentSelector)
        .then(data => console.log(data))
        .catch(error => console.error("Error fetching data:", error));
    // const html = await page.evaluate(() => document.title());
    // console.log(html)
}

scrape()
