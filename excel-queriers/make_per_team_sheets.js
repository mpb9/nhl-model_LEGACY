const XlsxPopulate = require('xlsx-populate');

async function copyDataToNewSpreadsheet() {
  try {
    // Load the source spreadsheet
    const sourceWorkbook = await XlsxPopulate.fromFileAsync('mp_sheets/all_team_all_games_imp.xlsx');

    // Create a new workbook for the filtered data
    const filteredWorkbook = await XlsxPopulate.fromBlankAsync();

    // Get the first sheet of the source workbook
    const sourceSheet = sourceWorkbook.sheet(0);

    // Get the first sheet of the filtered workbook
    const filteredSheet = filteredWorkbook.sheet(0);

    // Iterate through each row in the source sheet
    sourceSheet.usedRange().eachRow(async function(row, rowNumber) {
      // Check if the value in column A (index 1) equals 'NYR'
      if (row.cell(1).value() === 'NYR') {
        // Copy the entire row to the filtered sheet
        filteredSheet.row(rowNumber).style(sourceSheet.row(rowNumber).style());
        row.copyTo(filteredSheet.row(rowNumber));
      }
    });

    // Save the filtered workbook to a new file
    await filteredWorkbook.toFileAsync('filtered.xlsx');

    console.log('Data copied to the new spreadsheet successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

copyDataToNewSpreadsheet();
