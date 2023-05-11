const scraperObject = {
	url: 'https://www.hockey-reference.com/playoffs/NHL_2023_goalies.html',
	async scraper(browser){
		let page = await browser.newPage();
    
    let year = 2004;
    let baseURL = this.url;
    this.url = baseURL;
		await page.goto(this.url);
    
    let yearByYearData = [];
    async function scrapeCurrentPage(){
      /* 
      statmuse: 
        document.querySelector("#container > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(4)")
          url: 'https://www.statmuse.com/nhl',
          this.url = baseURL + '/ask?q=nhl+team+records+in+the+' + (year-1) + '%2F' + (year) + '+season';
          const dataTable = await page.$('#container > div.relative.overflow-x-auto > table');
          const tableResults = await dataTable.$('tbody');
          let teams = await tableResults.$$eval('tr > td', teams =>

      natural stat trick:
        document.querySelector("#teams > tbody > tr:nth-child(1) > td:nth-child(1)")
	        url: 'https://www.naturalstattrick.com/games.php?fromseason=20222023&thruseason=20222023&stype=3&sit=5v5&loc=B&team=CAR&rate=n',
          const dataTable = await page.$('#teams');
          const tableResults = await dataTable.$('tbody');
          let teams = await tableResults.$$eval('tr > td', teams => {

      hockey-reference:
        document.querySelector("#stats > tbody > tr:nth-child(1) > td:nth-child(5)")
        	url: 'https://www.hockey-reference.com/playoffs/NHL_2023_goalies.html',
          const dataTable = await page.$('#stats');
          const tableResults = await dataTable.$('tbody');
          let teams = await tableResults.$$eval('tr > td', teams => {

      */
      const dataTable = await page.$('#stats');
      const tableResults = await dataTable.$('tbody');
      //console.log(dataTable);
      //console.log(tableResults);

      let teamByTeamData = [];
      
      let teams = await tableResults.$$eval('tr > td', teams => {
        teams = teams.map(team => team.textContent);
        teams = teams.filter(team => team.length !== 0);
        console.log(teams);
        return teams;
      });

      for(i=0; i< teams.length; i++){
        console.log(teams[i]);
        /* const teamData = {};
        if(year >= 2006){
          teamData['TEAM'] = teams[i]; 
          teamData['GP'] = teams[i+2]; teamData['RECORD'] = teams[i+3]; 
          teamData['PTS'] = teams[i+4]; teamData['W'] = teams[i+5];
          teamData['L'] = teams[i+6]; teamData['OTL'] = teams[i+7]; 
          teamData['PTS_PCT'] = teams[i+8]; teamData['G'] = teams[i+9]; 
          teamData['GA'] = teams[i+10]; teamData['PP_PCT'] = teams[i+11]; 
          teamData['PK_PCT'] = teams[i+12]; teamData['S_PER_GP'] = teams[i+13]; 
          teamData['SA_PER_GP'] = teams[i+14];
          i--;
        } else {
          teamData['TEAM'] = teams[i]; 
          teamData['GP'] = teams[i+2]; teamData['RECORD'] = teams[i+3]; 
          teamData['PTS'] = teams[i+4]; teamData['W'] = teams[i+5];
          teamData['L'] = teams[i+6]; teamData['T'] = teams[i+7]; 
          teamData['OTL'] = teams[i+8]; teamData['PTS_PCT'] = teams[i+9]; 
          teamData['G'] = teams[i+10]; teamData['GA'] = teams[i+11]; 
          teamData['PP_PCT'] = teams[i+12]; teamData['PK_PCT'] = teams[i+13]; 
          teamData['S_PER_GP'] = teams[i+14]; teamData['SA_PER_GP'] = teams[i+15];
        }
        teamByTeamData.push(teamData); */
      }

      // yearByYearData.push([(year-1) + "-" + year, teamByTeamData])

      /* if(year < 2022){
        year++;
        year = year === 2005 ? 2006 : year;
        await page.goto(baseURL + '/ask?q=nhl+team+records+in+the+' + (year-1) + '%2F' + year + '+season');
        return scrapeCurrentPage();
      }
      await page.close();
      return yearByYearData; */
    }

    let data = await scrapeCurrentPage();
    return data;
    
	}
}

module.exports = scraperObject;