# Adapt Engineering Take-home
David Kurtz <br>
jemenfiche@gmail.com

## How to run

`yarn install`

`yarn run --silent start`

### What it does

index.ts has a main function which takes an "input", supplied in the original
take-home assignment spec. 

    [{
        "carrier": "MOCK_INDEMNITY",
        "customerId": "a0dfjw9a"
    },{
      "carrier": "PLACEHOLDER_CARRIER",
        "customerId": "f02dkl4e"
    }]

The script fetches a website associated with the given carrier and returns a 
json response containing data found for the given customer id.

### Organization

There is a scrapers directory which exposes various scraping strategies in the 
form of a module. Each strategy is specific to a particular carrier. The 
strategy contains all the logic for scraping data from that carrier.

Each scraper module exposes a 'scrapeCustomer' function. Each scraper module
could conceivably expose many other methods to scrape data related to that 
carrier.

Each scraper strategy is free to use its own methods for scraping data.

I separated "how" to fetch from the individual scrapers. some scrapers may use 
the same library; others my have radically different ways of retrieving data.
Maybe insurance policy updates  are available via a simple api call; maybe they
get sent to an email address which must be checked? At a very high, hand-wavy 
level, this basic structure should accommodate such challenges.

Similarly, the parsing library and methodology is up to the individual
scraper. Maybe cheerio is not the right tool, maybe the data is not HTML; 
maybe it's JSON or a PDF.

### Constraints

Most of my time was eaten up figuring out how to parse the PLACEHOLDER\_CARRIER
carrier url, and re-familiarizing myself with cheerio/jquery.

#### Typescript

Due to time considerations, I did not attempt to specify a robust type language
for the final data format. Some of what I would have liked to do is merely 
implied by the format of the response from the scrapeCustomer function, that is,
something along the lines of 

    type Agency = {
        name: string
        code: string
    }
    type Agent = {
        name: string
        producerCode: string
        agency: Agency
    }
    type Policy = {
      id: string
      premium: number
      status: string
      effectiveDate: Date
      terminationDate: Date
      lastPaymentDate: Date
    }
    type Customer = {
        name: string
        id: string
        email: string
        address: string
        agent: Agent
        policies: [Policy]
    }

#### Exception Handling

Additionally, and probably more grievously, I did little to no exception
or error handling, and there are plenty of places to do it. Namely:

 - url retrieval/fetch
   how to recover if there are network errors, incorrect urls, etc.
 - exceptions in parsing the fetched documents
   websites change all the time, and a production version of this would
   likely encounter exceptions regularly as sites are updated, edge cases
   emerge, fields are added or removed. My parsing code is very naive.
 - also no account for missing data
   again, I am relying on this being a time-limited, constrained toy demo

#### Omitted fields

The PLACEHOLDER_CARRIER carrier site had some additional fields for the 
policies that the MOCK_INDEMNITY site did not. I opted not to include these.
Again, mostly a consideration of time and hemming and hawing on how I would
handle it on a typescript level.

