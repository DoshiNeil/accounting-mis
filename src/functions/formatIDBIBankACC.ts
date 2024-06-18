export function promptForAccountNumber(): void {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Account Number', 'Enter last 4 digits of the Acc', ui.ButtonSet.OK_CANCEL);

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
  const range = sourceSheet.getRange(6, 3, lastRow - 5, 10); // (startRow, startColumn, numRows, numColumns)

  // Get the values from the source range
  const values = range.getValues();
  
  // Set the values to the new sheet starting from cell A1
  destinationSheet.getRange(1, 1, values.length, values[0].length).setValues(values);
}

