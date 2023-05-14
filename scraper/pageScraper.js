const scraperObject = {
	async scraper(browser, webpages, pagePaths){
		let page = await browser.newPage();
    let page_index = 0;
		await page.goto(webpages[page_index]);
    
    let scraped_data = [];

    async function scrapeCurrentPage(){
      const path_to_data = await page.$(pagePaths.toAllData);
      
      let page_raw_data = await path_to_data.$$eval(pagePaths.toDataElement, page_raw_data => {
        page_raw_data = page_raw_data.map(data_element => data_element.textContent);
        page_raw_data = page_raw_data.filter(data_element => data_element.length !== 0);
        return page_raw_data;
      });

      let numRow = Math.ceil(page_raw_data.length/Number(pagePaths.numCols));
      let page_data = []

      for(i=0; i< numRow; i++){
        let index = (i)*Number(pagePaths.numCols);
        let finalIndex = index +  Number(pagePaths.numCols);
        const row_data = [];
        while(index < finalIndex){
          row_data.push(page_raw_data[index]);
          index++;
        }
        page_data.push(row_data);
        
      }

      scraped_data.push(page_data);
      page_index++;
      if(page_index < webpages.length){
        await page.goto(webpages[page_index]);
        return scrapeCurrentPage();
      }

      await page.close();
      return scraped_data;
    }

    let data = await scrapeCurrentPage();
    return data;
    
	},

  async headerScraper(browser, webpages, pagePaths){
    let page = await browser.newPage();
		await page.goto(webpages[0]);

    async function firstPageHeaders(){
      const path_to_headers = await page.$(pagePaths.toAllHeaders);
      let page_headers = await path_to_headers.$$eval(pagePaths.toHeaderElement, page_headers => {
        page_headers = page_headers.map(header_element => header_element.textContent);
        page_headers = page_headers.filter(header_element => header_element.length !== 0);
        return page_headers;
      });

      return page_headers;
    }

    let headers = await firstPageHeaders();
    return headers;

  }
}

module.exports = scraperObject;