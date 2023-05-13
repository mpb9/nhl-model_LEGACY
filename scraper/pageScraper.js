const scraperObject = {
	/* url: 'https://www.hockey-reference.com/playoffs/NHL_2023_goalies.html', */
	async scraper(browser, webpages, pagePaths){
		let page = await browser.newPage();
		await page.goto(webpages[0]);
    
    let scraped_data = [];

    async function scrapeCurrentPage(){
      const table = await page.$(pagePaths.toTable);
      const path_to_data = await table.$(pagePaths.toAllData);
      
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
      await page.close();
      return page_data;
    }

    let data = await scrapeCurrentPage();
    return data;
    
	}
}

module.exports = scraperObject;