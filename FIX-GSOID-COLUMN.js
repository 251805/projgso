/**
 * Script to fix missing GSOID# column in Google Sheets
 * Run this in Apps Script editor to add the missing GSOID# column
 */

function fixMissingGSOIDColumn() {
  const ss = SpreadsheetApp.openById("1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U");
  
  // Fix PR_DATABASE sheet
  const prSheet = ss.getSheetByName("PR_DATABASE");
  if (prSheet) {
    const currentHeaders = prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0];
    Logger.log("Current PR_HEADERS: " + JSON.stringify(currentHeaders));
    
    // Check if GSOID# column exists
    const hasGSOID = currentHeaders.includes("GSOID#");
    Logger.log("Has GSOID# column: " + hasGSOID);
    
    if (!hasGSOID) {
      // Insert GSOID# column at position 5 (before PR#)
      prSheet.insertColumnBefore(5);
      prSheet.getRange(1, 5).setValue("GSOID#");
      Logger.log("Inserted GSOID# column at position 5");
      
      // Update headers to proper order
      const newHeaders = [
        "Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", 
        "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
        "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
      ];
      prSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders])
        .setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
      Logger.log("Updated PR_DATABASE headers to include GSOID#");
    }
  }
  
  // Fix DR_DATABASE sheet
  const drSheet = ss.getSheetByName("DR_DATABASE");
  if (drSheet) {
    const currentDRHeaders = drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0];
    Logger.log("Current DR_HEADERS: " + JSON.stringify(currentDRHeaders));
    
    // Check if GSOID# column exists
    const hasDRGSOID = currentDRHeaders.includes("GSOID#");
    Logger.log("Has DR GSOID# column: " + hasDRGSOID);
    
    if (!hasDRGSOID) {
      // Insert GSOID# column at position 2 (before PR#)
      drSheet.insertColumnBefore(2);
      drSheet.getRange(1, 2).setValue("GSOID#");
      Logger.log("Inserted GSOID# column at position 2");
      
      // Update headers to proper order
      const newDRHeaders = [
        "Timestamp", "GSOID#", "PR#", "DEPARTMENT", "DATE", "SECTION", "REMARKS", 
        "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
        "QTY_PURCHASED", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
      ];
      drSheet.getRange(1, 1, 1, newDRHeaders.length).setValues([newDRHeaders])
        .setFontWeight("bold").setBackground("#16a34a").setFontColor("white");
      Logger.log("Updated DR_DATABASE headers to include GSOID#");
    }
  }
  
  // Verify the fix
  const verifyPR = ss.getSheetByName("PR_DATABASE");
  const verifyDR = ss.getSheetByName("DR_DATABASE");
  
  if (verifyPR && verifyDR) {
    const prHeaders = verifyPR.getRange(1, 1, 1, verifyPR.getLastColumn()).getValues()[0];
    const drHeaders = verifyDR.getRange(1, 1, 1, verifyDR.getLastColumn()).getValues()[0];
    
    Logger.log("=== VERIFICATION ===");
    Logger.log("PR_DATABASE Headers: " + JSON.stringify(prHeaders));
    Logger.log("DR_DATABASE Headers: " + JSON.stringify(drHeaders));
    
    const prHasGSOID = prHeaders.includes("GSOID#");
    const drHasGSOID = drHeaders.includes("GSOID#");
    
    Logger.log("PR GSOID# Fixed: " + prHasGSOID);
    Logger.log("DR GSOID# Fixed: " + drHasGSOID);
    
    if (prHasGSOID && drHasGSOID) {
      Logger.log("✅ SUCCESS: Both sheets now have GSOID# column");
      return "GSOID# column successfully added to both sheets";
    } else {
      Logger.log("❌ ERROR: GSOID# column still missing");
      return "Failed to add GSOID# column";
    }
  }
  
  return "GSOID# column fix completed";
}

// Run the fix function
const result = fixMissingGSOIDColumn();
Logger.log("Final Result: " + result);
