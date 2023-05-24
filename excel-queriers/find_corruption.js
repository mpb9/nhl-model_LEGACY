const XlsxPopulate = require('xlsx-populate');

async function checkFileValidity(filePath) {
  try {
    await XlsxPopulate.fromFileAsync(filePath);
    console.log('The file is valid and not corrupted.');
  } catch (error) {
    console.error('An error occurred while loading the file:', error);
    console.log('The file is invalid or corrupted.');
  }
}

checkFileValidity('mp_sheets/mp_all_teams.xlsx');
