const pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance, requestInstance){
	let browser;
  let req_data;
	try{
		browser = await browserInstance;
    req_data = await requestInstance;

		let headers = [];
		console.log(req_data.pagePath.toAllHeaders);

		if(req_data.pagePath.toAllHeaders === 'NA' || req_data.pagePath.toAllHeaders === 'na'){
			for(let i=0; i < req_data.pagePath.numCols; i++){
				headers.push('col_' + String(i+1));
			}
		} else {
			headers = await pageScraper.headerScraper(browser, req_data.websites, req_data.pagePath);
		}

    // let headers_json = JSON.stringify(headers);
		
    /* fs.writeFile("trialHeaders.json", headers_json, 'utf8', function(err){
			if(err) {	return console.log(err); } 
			console.log("Headers saved at './trialHeaders.json'");
		}); */

    let data_json = JSON.stringify(await pageScraper.scraper(browser, req_data.websites, req_data.pagePath, headers.length));

		/* fs.writeFile("trialData.json", data_json, 'utf8', function(err){
			if(err) {	return console.log(err); } 
			console.log("Data saved at './trialData.json'");
		}); */

    await browser.close();
    console.log("Browser Closed.");  console.log("");

    let body = JSON.parse(data_json);

    return {headers, body};
	}
	catch(err){ console.log("Could not resolve the browser instance => ", err); }
}

module.exports = (browserInstance,requestInstance) => scrapeAll(browserInstance,requestInstance)