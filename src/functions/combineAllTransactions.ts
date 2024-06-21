import { constants } from "../util/contants";

export function combineAllTransactions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ss.getSheets().map((s) => s.getName());

  const filteredSheets = sheetNames.filter((s) =>
    /(SBI\d{4,5}|SBICC\d{4,5}|IDBICC\d{4,5}|IDBI\d{4,5})/.test(s),
  );

  let destinationSheet = ss.getSheetByName("CombineTransactions");

  // Create a new sheet if it doesn't already exist
  if (!destinationSheet) {
    destinationSheet = ss.insertSheet("CombineTransactions");
  } else {
    // Clear the existing sheet
    destinationSheet.clear();
  }

  destinationSheet.appendRow(constants.headers);

  // Format the headers
  const headerRange = destinationSheet.getRange(1, 1, 1, constants.headers.length);
  headerRange.setFontWeight("bold").setBackground("#cccccc").setHorizontalAlignment("center");

  filteredSheets.forEach((s) => {
    const sourceSheet = ss.getSheetByName(s);
    if (sourceSheet) {
      const lastRow = sourceSheet.getLastRow();
      const range = sourceSheet.getRange(2, 1, lastRow, 8);
      const values = range.getValues();
      if (destinationSheet) {
        destinationSheet
          .getRange(destinationSheet.getLastRow() + 1, 1, values.length, values[0].length)
          .setValues(values);
      }
    }
  });
  const lastRow = destinationSheet.getLastRow();
  const range = destinationSheet.getRange(2, 1, lastRow, 8);
  const values = range.getValues();

  // Set the number format for the amount column to Indian Rupee format
  destinationSheet.getRange(2, 7, values.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 5, values.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 6, values.length, 1).setNumberFormat(constants.currencyFormat);

  // Set date format for the txn date
  destinationSheet.getRange(2, 2, values.length, 1).setNumberFormat(constants.dateFormat);

  // sorting the rows by date and amount
  range.sort([
    { column: 2, ascending: true },
    { column: 7, ascending: true },
  ]);

  // Auto-resize columns to fit content
  for (let i = 1; i <= constants.headers.length; i++) {
    destinationSheet.autoResizeColumn(i);
  }
}
