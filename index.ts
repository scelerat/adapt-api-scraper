import scrapers from './src/scrapers'

async function scrape({ carrier, customerId }) {
    const { scrapeCustomer } = scrapers[carrier]    
    return scrapeCustomer(customerId)    // TODO: check validity of input and resulting strategy
}

async function main() {

  const inputs = [{
    "carrier": "MOCK_INDEMNITY",
    "customerId": "a0dfjw9a"
  },{
    "carrier": "PLACEHOLDER_CARRIER",
    "customerId": "f02dkl4e"
  }]
  Promise.all(inputs.map(input => scrape(input))).then(values => console.log(JSON.stringify(values)))
}

main()
