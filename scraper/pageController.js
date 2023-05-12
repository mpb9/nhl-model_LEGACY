const pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance, requestInstance){
	let browser;
  let req_data;
	try{
		browser = await browserInstance;
    req_data = await requestInstance;
    console.log(req_data);

		let raw_data = {};
		raw_data = await pageScraper.scraper(browser);	
		await browser.close();

    let data = JSON.stringify(raw_data);
		fs.writeFile("trialData.json", data, 'utf8', function(err){
			if(err) {	return console.log(err); } 
			console.log("Scraped and saved successfully! View it at './trialData.json'");
		});

    return data;
	}
	catch(err){ console.log("Could not resolve the browser instance => ", err); }
}

module.exports = (browserInstance,requestInstance) => scrapeAll(browserInstance,requestInstance)