//import { constants } from "../util/contants";

export function promptForSBIAccountNumber(): void {
  const ui = SpreadsheetApp.getUi();
  const accNumberField = ui.prompt(
    "Account Number",
    "Enter last 4 digits of the Acc",
    ui.ButtonSet.OK_CANCEL,
  );

  // Process the user's accNumberField.
  if (accNumberField.getSelectedButton() == ui.Button.OK) {
    const sheetName = ` SBI${accNumberField.getResponseText()}`;
    const firstTransactionRow = ui.prompt(
      "First Transaction",
      "Enter the first transaction row number",
      ui.ButtonSet.OK_CANCEL,
    );
    if (firstTransactionRow.getSelectedButton() === ui.Button.OK) {
      formatSBIBankAcc(sheetName, firstTransactionRow.getResponseText());
    }
  }
}

export function formatSBIBankAcc(sheetName: string, firstTrxRow: string): void {
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
  const range = sourceSheet.getRange(parseInt(firstTrxRow), 1, lastRow - 7, 3); // (startRow, startColumn, numRows, numColumns)

  // Get the values from the source range
  const values = range.getValues();

  // Define headers for the new sheet
  const headers = ["Sr No.", "Txn Date", "Description", "Cheque no", "CR", "DR", "Amount", "Bank Acc"];

  // Format the headers
  const headerRange = destinationSheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight("bold").setBackground("#cccccc").setHorizontalAlignment("center");

  // Transform the data to remove unwanted columns, split cd/dr, format date, and format amount
  const transformedValues = values.map((r, idx) => {
    const txnStr = r.reduce((str, v) => str + "\t" + v, "");
    const row = txnStr.trim().split("\t");
    return [idx, row[0], row[2], row[3], row[5], row[4], !!row[4] ? row[4] : row[5], sheetName];
  });

  // Set the headers to the new sheet
  destinationSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Set the transformed data to the new sheet
  destinationSheet
    .getRange(2, 1, transformedValues.length, transformedValues[0].length)
    .setValues(transformedValues);

  // Set the number format for the amount column to Indian Rupee format
  //destinationSheet.getRange(2, 7, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  //destinationSheet.getRange(2, 5, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  //destinationSheet.getRange(2, 6, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  //
  // Set date format for the txn date
  //destinationSheet.getRange(2, 2, transformedValues.length, 1).setNumberFormat(constants.dateFormat);

  // Auto-resize columns to fit content
  for (let i = 1; i <= headers.length; i++) {
    destinationSheet.autoResizeColumn(i);
  }
}
