/**
 * STANDALONE SPREADSHEET SETUP SCRIPT
 * This script will set up and verify the spreadsheet without conflicts
 * Copy ONLY this script to a new Apps Script project for setup
 */

function standaloneSetup() {
  try {
    // Define the spreadsheet ID
    const spreadsheetId = "1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U";
    
    // Verify the spreadsheet exists and is accessible
    const ss = SpreadsheetApp.openById(spreadsheetId);
    
    if (!ss) {
      throw new Error("Spreadsheet not found or inaccessible. Please check the ID: " + spreadsheetId);
    }
    
    // Get spreadsheet info
    const spreadsheetName = ss.getName();
    const spreadsheetUrl = ss.getUrl();
    
    // Log the setup results
    Logger.log("=== STANDALONE SPREADSHEET SETUP ===");
    Logger.log("Spreadsheet Name: " + spreadsheetName);
    Logger.log("Spreadsheet ID: " + spreadsheetId);
    Logger.log("Spreadsheet URL: " + spreadsheetUrl);
    Logger.log("Status: Spreadsheet is accessible and ready");
    
    // Test basic access
    const testSheet = ss.getActiveSheet();
    Logger.log("Active Sheet: " + testSheet.getName());
    
    // Check if required sheets exist
    const requiredSheets = ["PR_DATABASE", "DR_DATABASE", "INVENTORY_MASTER", "RIS_DATABASE"];
    const existingSheets = [];
    const missingSheets = [];
    
    for (const sheetName of requiredSheets) {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        existingSheets.push(sheetName);
      } else {
        missingSheets.push(sheetName);
      }
    }
    
    Logger.log("Existing Sheets: " + existingSheets.join(", "));
    Logger.log("Missing Sheets: " + missingSheets.join(", "));
    
    // Create missing sheets if needed
    for (const sheetName of missingSheets) {
      const newSheet = ss.insertSheet(sheetName);
      Logger.log("Created sheet: " + sheetName);
      
      // Add headers based on sheet type
      if (sheetName === "PR_DATABASE") {
        const headers = [
          "Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", 
          "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
          "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
        ];
        newSheet.getRange(1, 1, 1, headers.length).setValues([headers])
          .setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
      } else if (sheetName === "DR_DATABASE") {
        const headers = [
          "Timestamp", "GSOID#", "PR#", "DEPARTMENT", "DATE", "SECTION", "REMARKS", 
          "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
          "QTY_PURCHASED", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
        ];
        newSheet.getRange(1, 1, 1, headers.length).setValues([headers])
          .setFontWeight("bold").setBackground("#16a34a").setFontColor("white");
      } else if (sheetName === "INVENTORY_MASTER") {
        const headers = [
          "Timestamp", "STOCK_NO", "ITEM_DESCRIPTION", "LOCATION", "BIN", "QTY_ON_HAND", 
          "BUFFER_LEVEL", "LAST_COUNT_DATE", "ABC_CLASSIFICATION", "FSN_CLASSIFICATION", 
          "UNIT_COST", "TOTAL_VALUE", "LAST_UPDATED", "STATUS"
        ];
        newSheet.getRange(1, 1, 1, headers.length).setValues([headers])
          .setFontWeight("bold").setBackground("#f59e0b").setFontColor("white");
      } else if (sheetName === "RIS_DATABASE") {
        const headers = [
          "Timestamp", "RIS_NUMBER", "GSOID#", "DEPARTMENT", "REQUESTED_BY", "DATE_REQUESTED", 
          "DATE_ISSUED", "STOCK_NO", "ITEM_DESCRIPTION", "UNIT", "QTY_REQUESTED", 
          "QTY_ISSUED", "UNIT_COST", "TOTAL_COST", "PURPOSE", "REMARKS", "STATUS"
        ];
        newSheet.getRange(1, 1, 1, headers.length).setValues([headers])
          .setFontWeight("bold").setBackground("#8b5cf6").setFontColor("white");
      }
    }
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetName: spreadsheetName,
      spreadsheetUrl: spreadsheetUrl,
      existingSheets: existingSheets,
      createdSheets: missingSheets,
      message: "Standalone setup completed successfully"
    };
    
  } catch (error) {
    Logger.log("=== SETUP FAILED ===");
    Logger.log("Error: " + error.toString());
    return {
      success: false,
      error: error.toString(),
      message: "Standalone setup failed"
    };
  }
}

/**
 * Quick test function
 */
function quickTest() {
  const result = standaloneSetup();
  Logger.log("=== QUICK TEST RESULTS ===");
  Logger.log("Success: " + result.success);
  if (result.success) {
    Logger.log("Spreadsheet: " + result.spreadsheetName);
    Logger.log("Sheets created: " + result.createdSheets.join(", "));
  } else {
    Logger.log("Error: " + result.error);
  }
  return result;
}
