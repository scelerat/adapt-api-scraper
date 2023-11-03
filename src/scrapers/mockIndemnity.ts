import cheerio from "cheerio"
import { fetchContentFromUrl } from "../lib/fetchContentFromUrl";
export const baseUrl = 'https://scraping-interview.onrender.com';
export const path = 'mock_indemnity';
    // parentSelector: '.customer-detail .card-body',
function getCustomerData(data: string) {
    const $ = cheerio.load(data)

    return {
      customer: {
        name: $('.customer-detail .value-name').text(),
        id: $('.customer-detail .value-id').text(),
        email: $('.customer-detail .value-email').text(),
        address: $('.customer-detail .value-address').text(),
      }
    }
}

function getAgentData(data: string) {
  const $ = cheerio.load(data)
  return {
    name: $('.agent-detail .value-name').text(),
    producerCode: $('.agent-detail .value-producerCode').text()
  }
}

function getAgencyData(data: string) {
  const $ = cheerio.load(data)
  return {
    name: $('.agent-detail .value-agencyName').text(),
    code: $('.agent-detail .value-agencyCode').text()
  }
}
function getPolicyData(data: string) {
  const $ = cheerio.load(data)
  const policies = [];

  $('#policy-list .list-group-item').each(function () {
    // 'this' refers to the current row in the loop
    const $row = $(this);

    const id = $row.find('.id.value-holder').text().trim();
    const premium = $row.find('.premium.value-holder').text().trim();
    const status = $row.find('.status.value-holder').text().trim();
    const effectiveDate = $row.find('.effectiveDate.value-holder').text().trim();
    const terminationDate = $row.find('.terminationDate.value-holder').text().trim();
    const lastPaymentDate = $row.find('.lastPaymentDate.value-holder').text().trim();

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

  return policies
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
    const policies = getPolicyData(data[0])
    
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
