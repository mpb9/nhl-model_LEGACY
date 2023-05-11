const pageScraper = require('./pageScraper');
const fs = require('fs');

async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;

		let data = {};
		data = await pageScraper.scraper(browser);	

		await browser.close();

		fs.writeFile("fullSeasonTeamData.json", JSON.stringify(data), 'utf8', function(err){
			if(err) {
				return console.log(err);
			} 
			console.log("The data has been scraped and saved successfully! View it at './fullSeasonTeamData.json'");
		})

	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)