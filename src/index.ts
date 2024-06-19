// You can access any of the global GAS objects in this file. You can also

// import local files or external dependencies:
export { promptForSBIAccountNumber } from "./functions/formatSBIBankACC";
export  { promptForIDBIAccountNumber } from "./functions/formatIDBIBankACC";
// Simple Triggers: These five export functions are reserved export function names that are
// called by Google Apps when the corresponding event occurs. You can safely
// delete them if you won't be using them, but don't use the same export function names
// for anything else.
// See: https://developers.google.com/apps-script/guides/triggers

// NOTE: only `export {...}` syntax will work. You cannot define and export a trigger in
// the same line.

function onOpen(): void {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Accounting MIS')
    .addItem('Format IDBI Acc', 'promptForIDBIAccountNumber')
    .addItem('Format SBI Acc', 'promptForSBIAccountNumber')
    .addToUi();
}

function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit): void {
  console.log(e);
}

function onInstall(e: GoogleAppsScript.Events.AddonOnInstall): void {
  console.log(e);
}

function doGet(e: GoogleAppsScript.Events.DoGet): void {
  console.log(e);
}

function doPost(e: GoogleAppsScript.Events.DoPost): void {
  console.log(e);
}

export { onOpen, onEdit, onInstall, doGet, doPost  };
