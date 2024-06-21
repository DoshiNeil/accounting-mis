import { constants } from "../util/contants";
export function promptForIDBICCNumber(): void {
  const ui = SpreadsheetApp.getUi();
  const accNumberField = ui.prompt(
    "Account Number",
    "Enter last 4 digits of the CC",
    ui.ButtonSet.OK_CANCEL,
  );

  // Process the user's accNumberField.
  if (accNumberField.getSelectedButton() == ui.Button.OK) {
      formatIDBIBankCC(`IDBICC${accNumberField.getResponseText()}`);
  }
}

export function formatIDBIBankCC(sheetName: string): void {
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
  const range = sourceSheet.getRange(2, 1, lastRow, 5); // (startRow, startColumn, numRows, numColumns)

  // Get the values from the source range
  const values = range.getValues();

  // Format the constants.headers
  const headerRange = destinationSheet.getRange(1, 1, 1, constants.headers.length);
  headerRange.setFontWeight("bold").setBackground("#cccccc").setHorizontalAlignment("center");

  // Transform the data to remove unwanted columns, split cd/dr, format date, and format amount
  const transformedValues = values.map((row, idx) => {
    return [idx+1,row[0], row[1],'',row[3], row[2], row[4], sheetName];
  });

  // Set the constants.headers to the new sheet
  destinationSheet.getRange(1, 1, 1, constants.headers.length).setValues([constants.headers]);

  // Set the transformed data to the new sheet
  destinationSheet
    .getRange(2, 1, transformedValues.length, transformedValues[0].length)
    .setValues(transformedValues);

  // Set the number format for the amount column to Indian Rupee format
  destinationSheet.getRange(2, 7, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 5, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);
  destinationSheet.getRange(2, 6, transformedValues.length, 1).setNumberFormat(constants.currencyFormat);


  // Auto-resize columns to fit content
  for (let i = 1; i <= constants.headers.length; i++) {
    destinationSheet.autoResizeColumn(i);
  }
}
