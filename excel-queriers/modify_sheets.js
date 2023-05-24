const XlsxPopulate = require('xlsx-populate');

async function findValueInSpreadsheet() {
  try {
    const workbook = await XlsxPopulate.fromFileAsync('mp_sheets/thru_x.xlsx');
    //const r = workbook.sheet(0).range("A1:DD6465");
    const sheet = workbook.sheet("thru_190201");
    // Iterate through each cell in the sheet
    sheet.find("S.J", "SJS");
    /* sheet.find("T.B", "TBL");
    sheet.find("N.J", "NJD");
    sheet.find("L.A", "LAK"); */

    await workbook.toFileAsync('mp_sheets/thru_x.xlsx');


  } catch (error) {
    console.error('An error occurred:', error);
  }
}

findValueInSpreadsheet();
