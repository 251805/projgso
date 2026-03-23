/**
 * CRITICAL FIX: Add Missing GSOID# Column to Google Sheets
 * This script will insert GSOID# column in the correct position
 * RUN THIS IMMEDIATELY to restore system functionality
 */

function addMissingGSOIDColumnCritical() {
  const ss = SpreadsheetApp.openById("1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U");
  const result = {
    prFixed: false,
    drFixed: false,
    errors: []
  };
  
  try {
    // Fix PR_DATABASE sheet
    const prSheet = ss.getSheetByName("PR_DATABASE");
    if (prSheet) {
      const currentHeaders = prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0];
      Logger.log("PR_CURRENT_HEADERS: " + JSON.stringify(currentHeaders));
      
      // Check if GSOID# exists
      const gsoidIndex = currentHeaders.indexOf("GSOID#");
      const prIndex = currentHeaders.indexOf("PR#");
      
      Logger.log("PR_GSOID_Index: " + gsoidIndex);
      Logger.log("PR_PR_Index: " + prIndex);
      
      if (gsoidIndex === -1) {
        // GSOID# column missing - insert it before PR# column
        if (prIndex !== -1) {
          // Insert at PR# position, then PR# will shift right
          prSheet.insertColumnBefore(prIndex);
          prSheet.getRange(1, prIndex).setValue("GSOID#");
          Logger.log("PR_Inserted GSOID# at position " + prIndex);
        } else {
          // Insert at position 5 (default location)
          prSheet.insertColumnBefore(5);
          prSheet.getRange(1, 5).setValue("GSOID#");
          Logger.log("PR_Inserted GSOID# at position 5");
        }
        result.prFixed = true;
        
        // Update headers to proper order
        const newHeaders = [
          "Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", 
          "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
          "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
        ];
        prSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders])
          .setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
        Logger.log("PR_Headers updated to include GSOID#");
      } else {
        result.errors.push("PR_DATABASE: PR# column not found - cannot insert GSOID#");
      }
    } else {
      result.errors.push("PR_DATABASE sheet not found");
    }
    
    // Fix DR_DATABASE sheet
    const drSheet = ss.getSheetByName("DR_DATABASE");
    if (drSheet) {
      const currentDRHeaders = drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0];
      Logger.log("DR_CURRENT_HEADERS: " + JSON.stringify(currentDRHeaders));
      
      // Check if GSOID# exists
      const drGsoidIndex = currentDRHeaders.indexOf("GSOID#");
      const drPrIndex = currentDRHeaders.indexOf("PR#");
      
      Logger.log("DR_GSOID_Index: " + drGsoidIndex);
      Logger.log("DR_PR_Index: " + drPrIndex);
      
      if (drGsoidIndex === -1) {
        // GSOID# column missing - insert it at position 2
        if (drPrIndex !== -1) {
          // Insert at PR# position, then PR# will shift right
          drSheet.insertColumnBefore(drPrIndex);
          drSheet.getRange(1, drPrIndex).setValue("GSOID#");
          Logger.log("DR_Inserted GSOID# at position " + drPrIndex);
        } else {
          // Insert at position 2 (default location)
          drSheet.insertColumnBefore(2);
          drSheet.getRange(1, 2).setValue("GSOID#");
          Logger.log("DR_Inserted GSOID# at position 2");
        }
        result.drFixed = true;
        
        // Update headers to proper order
        const newDRHeaders = [
          "Timestamp", "GSOID#", "PR#", "DEPARTMENT", "DATE", "SECTION", "REMARKS", 
          "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
          "QTY_PURCHASED", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
        ];
        drSheet.getRange(1, 1, 1, newDRHeaders.length).setValues([newDRHeaders])
          .setFontWeight("bold").setBackground("#16a34a").setFontColor("white");
        Logger.log("DR_Headers updated to include GSOID#");
      } else {
        result.errors.push("DR_DATABASE: PR# column not found - cannot insert GSOID#");
      }
    } else {
      result.errors.push("DR_DATABASE sheet not found");
    }
    
    // Final verification
    const verifyPR = ss.getSheetByName("PR_DATABASE");
    const verifyDR = ss.getSheetByName("DR_DATABASE");
    
    if (verifyPR && verifyDR) {
      const finalPRHeaders = verifyPR.getRange(1, 1, 1, verifyPR.getLastColumn()).getValues()[0];
      const finalDRHeaders = verifyDR.getRange(1, 1, 1, verifyDR.getLastColumn()).getValues()[0];
      
      const finalPRHasGSOID = finalPRHeaders.includes("GSOID#");
      const finalDRHasGSOID = finalDRHeaders.includes("GSOID#");
      
      Logger.log("=== FINAL VERIFICATION ===");
      Logger.log("PR_Final_Headers: " + JSON.stringify(finalPRHeaders));
      Logger.log("DR_Final_Headers: " + JSON.stringify(finalDRHeaders));
      Logger.log("PR_GSOID_Fixed: " + finalPRHasGSOID);
      Logger.log("DR_GSOID_Fixed: " + finalDRHasGSOID);
      
      if (finalPRHasGSOID && finalDRHasGSOID) {
        result.message = "✅ SUCCESS: GSOID# column added to both sheets";
        Logger.log("✅ CRITICAL FIX SUCCESSFUL");
      } else {
        result.message = "❌ FAILED: GSOID# column still missing";
        Logger.log("❌ CRITICAL FIX FAILED");
      }
    }
    
  } catch (error) {
    result.errors.push("Script error: " + error.toString());
    Logger.log("ERROR: " + error.toString());
  }
  
  Logger.log("RESULT: " + JSON.stringify(result));
  return result;
}

// AUTO-RUN THE CRITICAL FIX
const fixResult = addMissingGSOIDColumnCritical();
Logger.log("CRITICAL FIX RESULT: " + JSON.stringify(fixResult));
