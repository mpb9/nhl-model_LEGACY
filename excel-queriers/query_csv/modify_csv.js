const NHL_Attributes = require('../../utility/nhl_attributes');
const CSV_Utilities = require('./utility_csv');
const fs = require('fs');
const csv = require('csv-parser');

function format_team_abbr(filename, subfolder, sourcepath) {
  const my_headers = [];
  const rows = [];

  CSV_Utilities.deleteOldCsvFile(filename, subfolder);
  CSV_Utilities.checkAndRenameFile(filename, subfolder);

  fs.createReadStream(sourcepath + filename +'.csv').pipe(csv())
    .on('headers', (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
    .on('data', (row) => {
      Object.keys(row).forEach((key) => {
        if(row[key] === 'T.B'){
          row[key] = 'TBL';
        }else if(row[key] === 'N.J'){
          row[key] = 'NJD';
        }else if(row[key] === 'S.J'){
          row[key] = 'SJS';
        }else if(row[key] === 'L.A'){
          row[key] = 'LAL';
        }
      });
      rows.push(row);
    })
    .on('end', () => CSV_Utilities.createNewCSV(filename, subfolder, my_headers, rows))
    .on('error', (error) => console.error('An error occurred:', error));
}




NHL_Attributes.nhl_teams.forEach((team) => {
  format_team_abbr(team, 'moneypuck', '../data/moneypuck/CSVs/');
});