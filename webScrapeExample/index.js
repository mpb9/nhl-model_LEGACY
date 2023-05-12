const express = require('express');
const cors = require('cors');

const app = express();

const browserObject = require('./browser');
const scraperController = require('./pageController');

// Use CORS middleware
app.use(cors());

// Define endpoint for starting the scraper
app.post('/start-scraper', async (req, res) => {
  //Start the browser and create a browser instance
  let browserInstance = browserObject.startBrowser();

  // Pass the browser instance to the scraper controller + send it to the client
  res.send(await scraperController(browserInstance))
}); 

// Start the server
app.listen(3000, () => {
  console.log('Scraper API listening on port 3000');
});
