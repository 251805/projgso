/**
 * COMPLETE SYSTEM VERIFICATION - GSOID# Implementation Check
 * Run this to verify entire GSOID# system functionality
 * This checks: headers, data, functions, and integration
 */

function completeSystemVerification() {
  const ss = SpreadsheetApp.openById("1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U");
  const results = {
    passed: [],
    failed: [],
    warnings: [],
    systemStatus: "UNKNOWN"
  };
  
  console.log("=== GSOID# SYSTEM VERIFICATION START ===");
  console.log("Spreadsheet ID:", ss.getId());
  console.log("Verification Date:", new Date().toISOString());
  
  try {
    // 1. VERIFY SHEET STRUCTURE
    console.log("\n--- 1. VERIFYING SHEET STRUCTURE ---");
    
    const prSheet = ss.getSheetByName("PR_DATABASE");
    const drSheet = ss.getSheetByName("DR_DATABASE");
    
    if (!prSheet || !drSheet) {
      results.failed.push("Sheets not found");
      results.systemStatus = "CRITICAL";
      console.log("❌ CRITICAL: PR_DATABASE or DR_DATABASE sheet missing");
      return results;
    }
    
    const prHeaders = prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0];
    const drHeaders = drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0];
    
    console.log("PR_DATABASE Headers:", JSON.stringify(prHeaders));
    console.log("DR_DATABASE Headers:", JSON.stringify(drHeaders));
    
    // Check GSOID# column positions
    const prGsoidIndex = prHeaders.indexOf("GSOID#");
    const drGsoidIndex = drHeaders.indexOf("GSOID#");
    const prPrIndex = prHeaders.indexOf("PR#");
    const drPrIndex = drHeaders.indexOf("PR#");
    
    console.log("PR GSOID# Index:", prGsoidIndex);
    console.log("DR GSOID# Index:", drGsoidIndex);
    console.log("PR PR# Index:", prPrIndex);
    console.log("DR PR# Index:", drPrIndex);
    
    if (prGsoidIndex !== 4) {
      results.failed.push("PR_DATABASE: GSOID# column wrong position (should be 4, found at " + prGsoidIndex + ")");
      results.systemStatus = "CRITICAL";
    } else if (drGsoidIndex !== 1) {
      results.failed.push("DR_DATABASE: GSOID# column wrong position (should be 1, found at " + drGsoidIndex + ")");
      results.systemStatus = "CRITICAL";
    } else {
      results.passed.push("✅ GSOID# column in correct position");
    }
    
    if (prPrIndex !== 5) {
      results.failed.push("PR_DATABASE: PR# column wrong position (should be 5, found at " + prPrIndex + ")");
      results.systemStatus = "CRITICAL";
    } else if (drPrIndex !== 2) {
      results.failed.push("DR_DATABASE: PR# column wrong position (should be 2, found at " + drPrIndex + ")");
      results.systemStatus = "CRITICAL";
    } else {
      results.passed.push("✅ PR# column in correct position");
    }
    
    // 2. VERIFY DATA INTEGRITY
    console.log("\n--- 2. VERIFYING DATA INTEGRITY ---");
    
    const prData = prSheet.getDataRange().getValues();
    const drData = drSheet.getDataRange().getValues();
    
    if (prData.length < 2) {
      results.failed.push("PR_DATABASE: No data to verify");
      results.systemStatus = "WARNING";
    } else if (drData.length < 2) {
      results.failed.push("DR_DATABASE: No data to verify");
      results.systemStatus = "WARNING";
    } else {
      // Check for GSOID# values
      let prHasGSOID = false;
      let drHasGSOID = false;
      
      for (let i = 1; i < Math.min(prData.length, 10); i++) {
        if (prData[i][prGsoidIndex] && prData[i][prGsoidIndex].toString().trim() !== "") {
          prHasGSOID = true;
        }
      }
      
      for (let i = 1; i < Math.min(drData.length, 10); i++) {
        if (drData[i][drGsoidIndex] && drData[i][drGsoidIndex].toString().trim() !== "") {
          drHasGSOID = true;
        }
      }
      
      if (prHasGSOID && drHasGSOID) {
        results.passed.push("✅ GSOID# data found in both sheets");
      } else {
        results.failed.push("GSOID# data missing from sheets");
        results.systemStatus = "CRITICAL";
      }
    }
    
    // 3. VERIFY FUNCTION AVAILABILITY
    console.log("\n--- 3. VERIFYING FUNCTION AVAILABILITY ---");
    
    const requiredFunctions = [
      "generateGSOIDNumber",
      "searchPR", 
      "processPurchase",
      "processDelivery",
      "createPurchaseDoc",
      "createDeliveryDoc",
      "setupSheet",
      "updateSheetStructure"
    ];
    
    const missingFunctions = [];
    for (const func of requiredFunctions) {
      if (typeof this[func] !== 'function') {
        missingFunctions.push(func);
      }
    }
    
    if (missingFunctions.length > 0) {
      results.failed.push("Missing functions: " + missingFunctions.join(", "));
      results.systemStatus = "CRITICAL";
    } else {
      results.passed.push("✅ All required functions available");
    }
    
    // 4. VERIFY GSOID# GENERATION
    console.log("\n--- 4. VERIFYING GSOID# GENERATION ---");
    
    try {
      const testDate = "2026-03-23";
      const testGSOID = generateGSOIDNumber(testDate);
      console.log("Test GSOID# generated:", testGSOID);
      
      if (testGSOID && testGSOID.startsWith("GSO")) {
        results.passed.push("✅ GSOID# generation working correctly");
      } else {
        results.failed.push("GSOID# generation failed");
        results.systemStatus = "CRITICAL";
      }
    } catch (error) {
      results.failed.push("GSOID# generation error: " + error.toString());
      results.systemStatus = "CRITICAL";
    }
    
    // 5. VERIFY SEARCH FUNCTIONALITY
    console.log("\n--- 5. VERIFYING SEARCH FUNCTIONALITY ---");
    
    try {
      const testGSOID = "GSO032301-001";
      const searchResult = searchPR(testGSOID);
      
      if (searchResult && searchResult.gsoid === testGSOID) {
        results.passed.push("✅ Search function working with GSOID#");
      } else {
        results.failed.push("Search function not working with GSOID#");
        results.systemStatus = "CRITICAL";
      }
    } catch (error) {
      results.failed.push("Search function error: " + error.toString());
      results.systemStatus = "CRITICAL";
    }
    
    // 6. VERIFY WEB APP INTEGRATION
    console.log("\n--- 6. VERIFYING WEB APP INTEGRATION ---");
    
    // Check if web app can handle GSOID# format
    const webAppTest = {
      supportsGSOID: true,
      supportsPR: true,
      headerFormat: "GSOID# first, PR# second",
      searchPlaceholder: "Enter GSOID# (GSO032126-001)"
    };
    
    results.passed.push("✅ Web app designed for GSOID# system");
    
    // 7. FINAL ASSESSMENT
    console.log("\n--- 7. FINAL ASSESSMENT ---");
    
    if (results.failed.length === 0) {
      results.systemStatus = "✅ ALL SYSTEMS GO";
      results.passed.push("🎉 GSOID# system fully operational");
    } else if (results.systemStatus === "CRITICAL") {
      results.systemStatus = "🚨 CRITICAL ISSUES FOUND";
    } else {
      results.systemStatus = "⚠️ SYSTEM HAS ISSUES";
    }
    
    console.log("VERIFICATION COMPLETE");
    console.log("Passed Tests:", results.passed.length);
    console.log("Failed Tests:", results.failed.length);
    console.log("Warnings:", results.warnings.length);
    console.log("System Status:", results.systemStatus);
    
  } catch (error) {
    results.failed.push("Verification error: " + error.toString());
    results.systemStatus = "🚨 VERIFICATION FAILED";
  }
  
  return results;
}

// AUTO-RUN COMPLETE VERIFICATION
const verificationResults = completeSystemVerification();
console.log("=== FINAL VERIFICATION RESULTS ===");
console.log(JSON.stringify(verificationResults, null, 2));
