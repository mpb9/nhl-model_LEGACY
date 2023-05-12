const express = require('express');
const cors = require('cors');

const app = express();
const browserObject = require('./browser');
const scraperController = require('./pageController');

app.use(cors());
app.use(express.json());

/* REQUEST BODY SCHEMA 
  {
    WEBSITES: string[],
    TABLE: {
      name: 'results',
      columns: [
        {name: string, type: string}
      ]
    },
    PAGEPATH: {
      toTable: string,
      toAllData: string,
      toDataElement: string
    }
  }
*/
app.post('/start-scraper', async (req, res) => {
  //console.log(req.body);
  //Start the browser and create a browser instance
  if(req.body != undefined){
    let browserInstance = browserObject.startBrowser();
    
    // Pass the browser instance to the scraper controller + send it to the client
    res.send(await scraperController(browserInstance, req.body));
  }
}); 

// Start the server
app.listen(3000, () => {
  console.log('Scraper API listening on port 3000');
});
