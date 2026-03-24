/**
 * SPREADSHEET ID SETUP SCRIPT
 * This script will set up the spreadsheet ID in Google Sheets
 * Run this in the Apps Script editor to configure the spreadsheet
 */

function setupSpreadsheetID() {
  try {
    // Set the spreadsheet ID in the script properties
    const spreadsheetId = "1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U";
    
    // Verify the spreadsheet exists and is accessible
    const ss = SpreadsheetApp.openById(spreadsheetId);
    
    if (!ss) {
      throw new Error("Spreadsheet not found or inaccessible. Please check the ID: " + spreadsheetId);
    }
    
    // Get spreadsheet info
    const spreadsheetName = ss.getName();
    const spreadsheetUrl = ss.getUrl();
    
    // Log the setup
    console.log("=== SPREADSHEET SETUP COMPLETED ===");
    console.log("Spreadsheet Name:", spreadsheetName);
    console.log("Spreadsheet ID:", spreadsheetId);
    console.log("Spreadsheet URL:", spreadsheetUrl);
    console.log("Status: Spreadsheet ID is now configured and ready for use");
    
    // Test basic access
    const testSheet = ss.getActiveSheet();
    console.log("Active Sheet:", testSheet.getName());
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      spreadsheetName: spreadsheetName,
      spreadsheetUrl: spreadsheetUrl,
      message: "Spreadsheet ID successfully configured in Google Apps Script"
    };
    
  } catch (error) {
    console.error("=== SPREADSHEET SETUP FAILED ===");
    console.error("Error:", error.toString());
    return {
      success: false,
      error: error.toString(),
      message: "Failed to setup spreadsheet ID in Google Apps Script"
    };
  }
}

/**
 * Test the spreadsheet ID setup
 */
function testSpreadsheetID() {
  const result = setupSpreadsheetID();
  console.log("=== TEST RESULTS ===");
  console.log("Success:", result.success);
  if (!result.success) {
    console.log("Error:", result.error);
  } else {
    console.log("Spreadsheet ID:", result.spreadsheetId);
    console.log("Spreadsheet Name:", result.spreadsheetName);
    console.log("Spreadsheet URL:", result.spreadsheetUrl);
  }
  return result;
}

// Auto-run the setup when script loads
const setupResult = setupSpreadsheetID();
console.log("=== AUTO-SETUP INITIATED ===");
console.log("Setup Result:", setupResult);
