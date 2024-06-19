import { constants } from "../util/contants";

export function promptForAccountNumber(): void {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt("Account Number", "Enter last 4 digits of the Acc", ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  if (response.getSelectedButton() == ui.Button.OK) {
    const sheetName = ` IDBI${response.getResponseText()}`;
    formatIDBIBankAcc(sheetName);
  }
}

export function formatIDBIBankAcc(sheetName: string): void {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getActiveSheet();
  let destinationSheet = ss.getSheetByName(sheetName);

  // Create a new sheet if it doesn't already exist
  if (!destinationSheet) {
    destinationSheet = ss.insertSheet(sheetName);
  } else {
    // Clear the existing sheet
    destinationSheet.clear();
  }

  // Define the range for the table: C6 to L (last row with data)
  const lastRow = sourceSheet.getLastRow();
  const range = sourceSheet.getRange(7, 3, lastRow - 5, 10); // (startRow, startColumn, numRows, numColumns)

  // Get the values from the source range
  const values = range.getValues();

  // Define headers for the new sheet
  const headers = ["Sr No.", "Txn Date", "Description", "Cheque no", "CR", "DR", "Amount", "Bank Acc"];

  // Format the headers
  const headerRange = destinationSheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold").setBackground("#cccccc").setHorizontalAlignment("center");

  // Transform the data to remove unwanted columns, split cd/dr, format date, and format amount
  const transformedValues = values.map((row) => {
    const cr = row[5] === "Cr." ? row[7] : ""; // Amount in CR column if 'CR'
    const dr = row[5] === "Dr." ? row[7] : ""; // Amount in DR column if 'DR'

    return [
      row[0],
      row[2],
      row[3],
      row[4],
      cr !== "" ? parseFloat(cr.replace(/,/g, "")) : cr,
      dr !== "" ? parseFloat(dr.replace(/,/g, "")) : dr,
      parseFloat(row[7].replace(/,/g, "")),
      sheetName
    ]; // Selected and transformed columns
  });

  // Set the headers to the new sheet
  destinationSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Set the transformed data to the new sheet
  destinationSheet
    .getRange(2, 1, transformedValues.length, transformedValues[0].length)
    .setValues(transformedValues);

  // Set the number format for the amount column to Indian Rupee format
  destinationSheet.getRange(2, 7, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 5, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 6, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);

  // Set date format for the txn date
  destinationSheet.getRange(2, 2, transformedValues.length, 1).setNumberFormat(constants.dateFormat);

  // Auto-resize columns to fit content
  for (let i = 1; i <= headers.length; i++) {
    destinationSheet.autoResizeColumn(i);
  }
}
