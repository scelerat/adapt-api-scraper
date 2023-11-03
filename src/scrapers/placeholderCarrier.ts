import cheerio from "cheerio"
import { fetchContentFromUrl } from "../lib/fetchContentFromUrl";
export const baseUrl = 'https://scraping-interview.onrender.com';
export const path = 'placeholder_carrier';

function getCustomerData(data: string) {
    const $ = cheerio.load(data)

    return {
      customer: {
        name: $('.customer-details [for|="name"] + span').text(),
        id: $('.customer-details .card-body  > div:nth-child(3) span').text(),
        email: $('.customer-details .card-body  > label')[0].next.data,
        address: $('.customer-details .card-body  > div:nth-child(6)').html().split('Address: ')[1],
      }
    }
}

function getAgentData(data: string) {
  const $ = cheerio.load(data)
  return {
    name: $('.agency-details [for|="name"] + span').text(),
    producerCode: $('.agency-details [for|="producerCode"] + span').text()
  }
}

function getAgencyData(data: string) {
  const $ = cheerio.load(data)
  return {
    name: $('.agency-details [for|="agencyName"] + span').text(),
    code: $('.agency-details [for|="agencyCode"] + span').text()
  }
}
function getPolicyData(data: string) {
  const $ = cheerio.load(data)
  const policies = [];

  $('tbody tr.policy-info-row').each(function () {
    // 'this' refers to the current row in the loop
    const $row = $(this);

    const id = $row.find('td').eq(0).text().trim();
    const premium = $row.find('td').eq(1).text().trim();
    const status = $row.find('td').eq(2).text().trim();
    const effectiveDate = $row.find('td').eq(3).text().trim();
    const terminationDate = $row.find('td').eq(4).text().trim();

    // Use the .next() method to get the next sibling in the DOM tree, which is the details row
    const detailsRowHtml = $row.next('tr').find('td.details-row').html();

    // Load the details row HTML into cheerio to extract the Last Payment Date
    const $details = cheerio.load(detailsRowHtml);
    // Extract the Last Payment Date, assuming it always follows the "Last Payment Date:" text
    const lastPaymentDateText = $details('div').text();
    const lastPaymentDateMatches = lastPaymentDateText.match(/Last Payment Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
    const lastPaymentDate = lastPaymentDateMatches ? lastPaymentDateMatches[1].trim() : '';

    // Create an object with the extracted data
    const policyInfo = {
      id,
      premium,
      status,
      effectiveDate,
      terminationDate,
      lastPaymentDate
    };

    // Push the object into the array
    policies.push(policyInfo);
  });

  const nextUrl = $('tfoot tr td a:nth-child(2)').attr('href');

  return {
    items: policies,
    nextUrl
  }
}

export async function scrapeCustomer(customerId) {
    let data;
    let url = [baseUrl, path, customerId].join('/')

    try {
      data = await fetchContentFromUrl(url, '#root') 
    } catch (error) {
        console.error("Error fetching data:", error)
    }
    const customer = getCustomerData(data[0])
    const agent = getAgentData(data[0])
    const agency = getAgencyData(data[0])
    let { items: policies, nextUrl } = getPolicyData(data[0])
    
    while (nextUrl) {
      let items;
      let url = [baseUrl, nextUrl].join('/').replace(/([^:]\/)\/+/g, "$1");
      data = await fetchContentFromUrl(url, '.policy-details')
      if (!data) break;
      ({ items, nextUrl } = getPolicyData(data[0]))
      
      policies = [...policies, ...items]
    }
    const result = {
      ...customer,
      agent: {
        ...agent,
        agency
      },
      policies
    }
    return result
}
