/**
 * CHUCKGPT UNIFIED PROCUREMENT & DELIVERY SYSTEM - V6.2
 * Master Spreadsheet: 1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U
 * Logic: Combined Procurement (Blue) and Delivery (Green) modules.
 * UPDATED: GSOID# now serves as main system ID, PR# is optional field.
 * ENHANCED: Zero-Hallucination Inventory Management System
 * NO CODE SHORTCUTS - FULL SCRIPT DELIVERY MANDATE.
 */

// --- GLOBAL CONFIGURATION ---
const MASTER_SPREADSHEET_ID = "1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U";
const PR_SHEET_NAME = "PR_DATABASE";
const DR_SHEET_NAME = "DR_DATABASE";
const INVENTORY_SHEET_NAME = "INVENTORY_MASTER";
const RIS_SHEET_NAME = "RIS_DATABASE";

// Folder & Template IDs - Purchase
const FOLDER_ID_PURCHASE = "1jxg9bn923U15yW2D9jzJKP9bca6YCu9k";
const TEMPLATE_ID_PURCHASE = "1tzgj1HuQeJP4ncfSg3apb2lJl7L2H1cgNTOyHWty6fM";

// Folder & Template IDs - Delivery
const FOLDER_ID_DELIVERY = "16wD0f3u4KRmVKWLw8HpFBRWtsWLESSF4";
const TEMPLATE_ID_DELIVERY = "1YNBVvFUO2Dk1SiiXvefQ99T9lB3XzaV1ryo6fBsIpJI";

// Price List Link
const PRICELIST_LINK = "https://script.google.com/macros/s/AKfycbzGkFdEOry2OYwepK98sFr0hta1DDKOOwB8kl9KV1DZpCpwIyvv35sTobUJyfHlXvum/exec";

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('GSO Procurement & Delivery')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Check and display current Google Sheets structure
 */
function checkSheetStructure() {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  
  // Check PR_DATABASE sheet
  const prSheet = ss.getSheetByName(PR_SHEET_NAME);
  if (prSheet) {
    const prHeaders = prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0];
    Logger.log("PR_DATABASE Headers: " + JSON.stringify(prHeaders));
    Logger.log("PR_DATABASE Last Column: " + prSheet.getLastColumn());
    
    // Check if GSOID# exists
    const gsoidIndex = prHeaders.indexOf("GSOID#");
    const prIndex = prHeaders.indexOf("PR#");
    Logger.log("GSOID# found at index: " + gsoidIndex);
    Logger.log("PR# found at index: " + prIndex);
    
    // Get first few rows of data to verify
    const prData = prSheet.getRange(1, 1, Math.min(5, prSheet.getLastRow()), prSheet.getLastColumn()).getValues();
    Logger.log("PR_DATABASE Sample Data: " + JSON.stringify(prData));
  }
  
  // Check DR_DATABASE sheet
  const drSheet = ss.getSheetByName(DR_SHEET_NAME);
  if (drSheet) {
    const drHeaders = drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0];
    Logger.log("DR_DATABASE Headers: " + JSON.stringify(drHeaders));
    Logger.log("DR_DATABASE Last Column: " + drSheet.getLastColumn());
    
    // Check if GSOID# exists
    const drGsoidIndex = drHeaders.indexOf("GSOID#");
    const drPrIndex = drHeaders.indexOf("PR#");
    Logger.log("DR GSOID# found at index: " + drGsoidIndex);
    Logger.log("DR PR# found at index: " + drPrIndex);
    
    // Get first few rows of data to verify
    const drData = drSheet.getRange(1, 1, Math.min(5, drSheet.getLastRow()), drSheet.getLastColumn()).getValues();
    Logger.log("DR_DATABASE Sample Data: " + JSON.stringify(drData));
  }
  
  // Check INVENTORY_MASTER sheet
  const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
  if (inventorySheet) {
    const inventoryHeaders = inventorySheet.getRange(1, 1, 1, inventorySheet.getLastColumn()).getValues()[0];
    Logger.log("INVENTORY_MASTER Headers: " + JSON.stringify(inventoryHeaders));
    Logger.log("INVENTORY_MASTER Last Column: " + inventorySheet.getLastColumn());
  }
  
  // Check RIS_DATABASE sheet
  const risSheet = ss.getSheetByName(RIS_SHEET_NAME);
  if (risSheet) {
    const risHeaders = risSheet.getRange(1, 1, 1, risSheet.getLastColumn()).getValues()[0];
    Logger.log("RIS_DATABASE Headers: " + JSON.stringify(risHeaders));
    Logger.log("RIS_DATABASE Last Column: " + risSheet.getLastColumn());
  }
  
  return {
    prSheetExists: !!prSheet,
    drSheetExists: !!drSheet,
    inventorySheetExists: !!inventorySheet,
    risSheetExists: !!risSheet,
    prHeaders: prSheet ? prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0] : [],
    drHeaders: drSheet ? drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0] : [],
    inventoryHeaders: inventorySheet ? inventorySheet.getRange(1, 1, 1, inventorySheet.getLastColumn()).getValues()[0] : [],
    risHeaders: risSheet ? risSheet.getRange(1, 1, 1, risSheet.getLastColumn()).getValues()[0] : [],
    prRowCount: prSheet ? prSheet.getLastRow() : 0,
    drRowCount: drSheet ? drSheet.getLastRow() : 0,
    inventoryRowCount: inventorySheet ? inventorySheet.getLastRow() : 0,
    risRowCount: risSheet ? risSheet.getLastRow() : 0
  };
}

/**
 * Test function to generate a sample GSOID# and verify structure
 */
function testGSOIDGeneration() {
  const testDate = "2026-03-23";
  const gsoid = generateGSOIDNumber(testDate);
  Logger.log("Generated GSOID# for date " + testDate + ": " + gsoid);
  
  // Test search function
  const searchResult = searchPR(gsoid);
  if (searchResult) {
    Logger.log("Search Result Found: " + JSON.stringify(searchResult));
  } else {
    Logger.log("No search result found for GSOID#: " + gsoid);
  }
  
  return gsoid;
}

/**
 * Updates existing Google Sheets to new GSOID# structure
 */
function updateSheetStructure() {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  
  // Update PR_DATABASE sheet
  let prSheet = ss.getSheetByName(PR_SHEET_NAME);
  if (prSheet) {
    const currentHeaders = prSheet.getRange(1, 1, 1, prSheet.getLastColumn()).getValues()[0];
    const newHeaders = [
      "Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", 
      "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
      "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
    ];
    
    // Check if headers need updating
    let needsUpdate = false;
    for (let i = 0; i < newHeaders.length; i++) {
      if (currentHeaders[i] !== newHeaders[i]) {
        needsUpdate = true;
        break;
      }
    }
    
    if (needsUpdate) {
      // Insert new GSOID# column at position 5 (index 4)
      if (currentHeaders[4] !== "GSOID#") {
        prSheet.insertColumnBefore(5);
        prSheet.getRange(1, 5).setValue("GSOID#");
      }
      
      // Insert PR# column at position 6 (index 5) if it doesn't exist
      if (currentHeaders[5] !== "PR#") {
        prSheet.insertColumnBefore(6);
        prSheet.getRange(1, 6).setValue("PR#");
      }
      
      // Format headers
      prSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders])
        .setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
    }
  }

  // Update DR_DATABASE sheet
  let drSheet = ss.getSheetByName(DR_SHEET_NAME);
  if (drSheet) {
    const currentDRHeaders = drSheet.getRange(1, 1, 1, drSheet.getLastColumn()).getValues()[0];
    const newDRHeaders = [
      "Timestamp", "GSOID#", "PR#", "DEPARTMENT", "DATE", "SECTION", "REMARKS", 
      "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
      "QTY_PURCHASED", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
    ];
    
    // Check if DR headers need updating
    let needsDRUpdate = false;
    for (let i = 0; i < newDRHeaders.length; i++) {
      if (currentDRHeaders[i] !== newDRHeaders[i]) {
        needsDRUpdate = true;
        break;
      }
    }
    
    if (needsDRUpdate) {
      // Insert GSOID# column at position 2 (index 1)
      if (currentDRHeaders[1] !== "GSOID#") {
        drSheet.insertColumnBefore(2);
        drSheet.getRange(1, 2).setValue("GSOID#");
      }
      
      // Insert PR# column at position 3 (index 2)
      if (currentDRHeaders[2] !== "PR#") {
        drSheet.insertColumnBefore(3);
        drSheet.getRange(1, 3).setValue("PR#");
      }
      
      // Format headers
      drSheet.getRange(1, 1, 1, newDRHeaders.length).setValues([newDRHeaders])
        .setFontWeight("bold").setBackground("#16a34a").setFontColor("white");
    }
  }
  
  return "Sheet structure updated to GSOID# format";
}

/**
 * Initializes the master sheet structure with Inventory Management
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  
  let prSheet = ss.getSheetByName(PR_SHEET_NAME);
  if (!prSheet) {
    prSheet = ss.insertSheet(PR_SHEET_NAME);
    const prHeaders = [
      "Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", 
      "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
      "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
    ];
    prSheet.getRange(1, 1, 1, prHeaders.length).setValues([prHeaders])
      .setFontWeight("bold").setBackground("#1e293b").setFontColor("white");
  }

  let drSheet = ss.getSheetByName(DR_SHEET_NAME);
  if (!drSheet) {
    drSheet = ss.insertSheet(DR_SHEET_NAME);
    const drHeaders = [
      "Timestamp", "GSOID#", "PR#", "DEPARTMENT", "DATE", "SECTION", "REMARKS", 
      "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", 
      "QTY_PURCHASED", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"
    ];
    drSheet.getRange(1, 1, 1, drHeaders.length).setValues([drHeaders])
      .setFontWeight("bold").setBackground("#16a34a").setFontColor("white");
  }

  // Initialize INVENTORY_MASTER sheet
  let inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
  if (!inventorySheet) {
    inventorySheet = ss.insertSheet(INVENTORY_SHEET_NAME);
    const inventoryHeaders = [
      "Timestamp", "STOCK_NO", "ITEM_DESCRIPTION", "LOCATION", "BIN", "QTY_ON_HAND", 
      "BUFFER_LEVEL", "LAST_COUNT_DATE", "ABC_CLASSIFICATION", "FSN_CLASSIFICATION", 
      "UNIT_COST", "TOTAL_VALUE", "LAST_UPDATED", "STATUS"
    ];
    inventorySheet.getRange(1, 1, 1, inventoryHeaders.length).setValues([inventoryHeaders])
      .setFontWeight("bold").setBackground("#f59e0b").setFontColor("white");
  }

  // Initialize RIS_DATABASE sheet
  let risSheet = ss.getSheetByName(RIS_SHEET_NAME);
  if (!risSheet) {
    risSheet = ss.insertSheet(RIS_SHEET_NAME);
    const risHeaders = [
      "Timestamp", "RIS_NUMBER", "GSOID#", "DEPARTMENT", "REQUESTED_BY", "DATE_REQUESTED", 
      "DATE_ISSUED", "STOCK_NO", "ITEM_DESCRIPTION", "UNIT", "QTY_REQUESTED", 
      "QTY_ISSUED", "UNIT_COST", "TOTAL_COST", "PURPOSE", "REMARKS", "STATUS"
    ];
    risSheet.getRange(1, 1, 1, risHeaders.length).setValues([risHeaders])
      .setFontWeight("bold").setBackground("#8b5cf6").setFontColor("white");
  }

  return "System Initialized with Inventory Management";
}

/**
 * Generates GSOID Number based on Date
 */
function generateGSOIDNumber(dateStr) {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(PR_SHEET_NAME) || setupSheet();
  const data = sheet.getDataRange().getValues();
  
  const dateObj = new Date(dateStr);
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const yy = String(dateObj.getFullYear()).substring(2);
  const datePart = `GSO${mm}${dd}${yy}`;
  let count = 1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] && data[i][4].toString().startsWith(datePart)) {
      count++;
    }
  }
  return `${datePart}-${count.toString().padStart(3, '0')}`;
}

/**
 * Searches the PR Database for details using GSOID#
 */
function searchPR(gsoidQuery) {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(PR_SHEET_NAME);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return null;
  const results = data.filter(row => row[4] && row[4].toString().toLowerCase() === gsoidQuery.toLowerCase());
  
  if (results.length === 0) return null;

  const firstMatch = results[0];
  let formattedDate = firstMatch[2];
  if (formattedDate instanceof Date) {
    formattedDate = Utilities.formatDate(formattedDate, "GMT+8", "yyyy-MM-dd");
  }

  return {
    gsoid: firstMatch[4],
    pr: firstMatch[5],
    dept: firstMatch[1],
    date: formattedDate.toString(),
    section: firstMatch[3],
    remarks: firstMatch[6],
    budget: firstMatch[7],
    bac: firstMatch[8],
    requestedBy: firstMatch[9],
    items: results.map(row => ({
      stockNo: row[10],
      unit: row[11],
      description: row[12],
      qty: row[13],
      unitCost: row[14],
      totalCost: row[15],
      actual: row[16] !== "" ? row[16] : row[13],
      notes: row[17] || ""
    }))
  };
}

/**
 * MODULE 1: Process Purchase Submission
 */
function processPurchase(formData) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(PR_SHEET_NAME) || setupSheet();
    const timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
    
    const gsoidNumber = formData.isEdit ? formData.gsoidNumber : generateGSOIDNumber(formData.date);
    
    if (formData.isEdit) {
      const data = sheet.getDataRange().getValues();
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][4].toString() === gsoidNumber.toString()) {
          sheet.deleteRow(i + 1);
        }
      }
    }

    const rows = formData.items.map(item => [
      timestamp,
      formData.department,
      formData.date,
      formData.section,
      gsoidNumber,
      formData.prNumber || "",
      formData.remarks,
      formData.budgetNo,
      formData.bacNo,
      formData.requestedBy,
      item.stockNo,
      item.unit,
      item.description,
      item.qty,
      item.unitCost,
      (parseFloat(item.qty) * parseFloat(item.unitCost)) || 0,
      "", 
      ""  
    ]);
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    const docUrl = createPurchaseDoc(formData, gsoidNumber, rows);
    return { success: true, gsoidNumber: gsoidNumber, prNumber: formData.prNumber || "", docUrl: docUrl };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * MODULE 2: Process Delivery Sync with Inventory Update
 */
function processDelivery(formData) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    let prSheet = ss.getSheetByName(PR_SHEET_NAME);
    let drSheet = ss.getSheetByName(DR_SHEET_NAME);
    if (!prSheet || !drSheet) {
      setupSheet();
      prSheet = ss.getSheetByName(PR_SHEET_NAME);
      drSheet = ss.getSheetByName(DR_SHEET_NAME);
    }

    const timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
    const prData = prSheet.getDataRange().getValues();
    let totalPurchased = 0;
    let totalReceived = 0;

    const drRows = formData.items.map(item => {
      const purchasedVal = parseFloat(item.qty) * parseFloat(item.unitCost) || 0;
      const receivedVal = parseFloat(item.actual) * parseFloat(item.unitCost) || 0;
      
      totalPurchased += purchasedVal;
      totalReceived += receivedVal;

      for (let i = 1; i < prData.length; i++) {
        if (prData[i][4].toString() === formData.gsoidNumber.toString() && 
            prData[i][12].toString() === item.description.toString()) {
          prSheet.getRange(i + 1, 17).setValue(item.actual); 
          prSheet.getRange(i + 1, 18).setValue(item.notes);  
        }
      }

      return [
        timestamp,
        formData.gsoidNumber,
        formData.prNumber || "",
        formData.department,
        formData.date,
        formData.section,
        formData.remarks,
        formData.budgetNo,
        formData.bacNo,
        formData.requestedBy,
        item.stockNo,
        item.unit,
        item.description,
        item.qty,
        item.unitCost,
        purchasedVal,
        item.actual,
        item.notes
      ];
    });

    drSheet.getRange(drSheet.getLastRow() + 1, 1, drRows.length, drRows[0].length).setValues(drRows);
    formData.totalPurchased = totalPurchased.toFixed(2);
    formData.totalReceived = totalReceived.toFixed(2);
    
    // Update inventory from delivery
    const inventoryUpdate = updateInventoryFromDelivery(formData);
    if (!inventoryUpdate.success) {
      return { success: false, error: "Inventory update failed: " + inventoryUpdate.error };
    }
    
    const docUrl = createDeliveryDoc(formData, drRows);
    return { 
      success: true, 
      gsoidNumber: formData.gsoidNumber, 
      prNumber: formData.prNumber || "", 
      docUrl: docUrl,
      inventoryUpdate: inventoryUpdate
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function createPurchaseDoc(formData, gsoidNumber, rows) {
  const folder = DriveApp.getFolderById(FOLDER_ID_PURCHASE);
  const template = DriveApp.getFileById(TEMPLATE_ID_PURCHASE);
  const newFile = template.makeCopy(`PR_${gsoidNumber}_${formData.department}`, folder);
  const doc = DocumentApp.openById(newFile.getId());
  const body = doc.getBody();

  body.replaceText("{{DEPARTMENT}}", formData.department || "");
  body.replaceText("{{DATE}}", formData.date || "");
  body.replaceText("{{SECTION}}", formData.section || "");
  body.replaceText("{{GSOID#}}", gsoidNumber);
  body.replaceText("{{PR#}}", formData.prNumber || "");
  body.replaceText("{{REMARKS}}", formData.remarks || "");
  body.replaceText("{{BUDGET#}}", formData.budgetNo || "");
  body.replaceText("{{BAC#}}", formData.bacNo || "");
  body.replaceText("{{REQUESTED_BY}}", formData.requestedBy || "");

  const tables = body.getTables();
  let itemTable, templateRowIndex;

  for (let i = 0; i < tables.length; i++) {
    for (let j = 0; j < tables[i].getNumRows(); j++) {
      if (tables[i].getRow(j).getText().indexOf("{{ITEM_DESCRIPTION}}") > -1) {
        itemTable = tables[i];
        templateRowIndex = j;
        break;
      }
    }
  }

  if (itemTable) {
    rows.forEach(rowData => {
      const newRow = itemTable.insertTableRow(templateRowIndex + 1);
      newRow.appendTableCell(rowData[10].toString());  
      newRow.appendTableCell(rowData[11].toString()); 
      newRow.appendTableCell(rowData[12].toString()); 
      newRow.appendTableCell(rowData[13].toString()); 
      newRow.appendTableCell(parseFloat(rowData[14]).toFixed(2)); 
      newRow.appendTableCell(parseFloat(rowData[15]).toFixed(2)); 
    });
    itemTable.removeRow(templateRowIndex);
  }

  doc.saveAndClose();
  return newFile.getUrl();
}

function createDeliveryDoc(formData, rows) {
  const folder = DriveApp.getFolderById(FOLDER_ID_DELIVERY);
  const template = DriveApp.getFileById(TEMPLATE_ID_DELIVERY);
  const newFile = template.makeCopy(`DR_${formData.gsoidNumber}_${formData.department}`, folder);
  const doc = DocumentApp.openById(newFile.getId());
  const body = doc.getBody();

  body.replaceText("{{DEPARTMENT}}", formData.department || "");
  body.replaceText("{{DATE}}", formData.date || "");
  body.replaceText("{{SECTION}}", formData.section || "");
  body.replaceText("{{GSOID#}}", formData.gsoidNumber || "");
  body.replaceText("{{PR#}}", formData.prNumber || "");
  body.replaceText("{{REMARKS}}", formData.remarks || "");
  body.replaceText("{{BUDGET#}}", formData.budgetNo || "");
  body.replaceText("{{BAC#}}", formData.bacNo || "");
  body.replaceText("{{REQUESTED_BY}}", formData.requestedBy || "");
  body.replaceText("{{TOTAL_PURCHASED}}", formData.totalPurchased || "0.00");
  body.replaceText("{{TOTAL_RECEIVED}}", formData.totalReceived || "0.00");

  const tables = body.getTables();
  let itemTable, templateRowIndex;

  for (let i = 0; i < tables.length; i++) {
    for (let j = 0; j < tables[i].getNumRows(); j++) {
      if (tables[i].getRow(j).getText().indexOf("{{ITEM_DESCRIPTION}}") > -1) {
        itemTable = tables[i];
        templateRowIndex = j;
        break;
      }
    }
  }

  if (itemTable) {
    rows.forEach(rowData => {
      const newRow = itemTable.insertTableRow(templateRowIndex + 1);
      newRow.appendTableCell(rowData[10].toString());  // STOCK_NO
      newRow.appendTableCell(rowData[11].toString()); // UNIT
      newRow.appendTableCell(rowData[12].toString()); // ITEM_DESCRIPTION
      newRow.appendTableCell(rowData[13].toString()); // QTY (Purchased)
      newRow.appendTableCell(parseFloat(rowData[14]).toFixed(2)); // UNIT_COST
      newRow.appendTableCell(parseFloat(rowData[15]).toFixed(2)); // TOTAL_COST
      newRow.appendTableCell(rowData[16].toString()); // ACTUAL (Delivered)
      newRow.appendTableCell(rowData[17].toString()); // NOTES
    });
    itemTable.removeRow(templateRowIndex);
  }

  doc.saveAndClose();
  return newFile.getUrl();
}

/**
 * MODULE 3: Inventory Management Functions - Zero Hallucination Logic
 */

/**
 * Updates inventory from delivery - Zero Hallucination Logic
 */
function updateInventoryFromDelivery(formData) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
    const timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
    
    if (!inventorySheet) {
      return { success: false, error: "INVENTORY_MASTER sheet not found" };
    }

    const inventoryData = inventorySheet.getDataRange().getValues();
    const inventoryHeaders = inventoryData[0];
    const stockNoIndex = inventoryHeaders.indexOf("STOCK_NO");
    const qtyOnHandIndex = inventoryHeaders.indexOf("QTY_ON_HAND");
    const lastUpdatedIndex = inventoryHeaders.indexOf("LAST_UPDATED");

    for (const item of formData.items) {
      const stockNo = item.stockNo.toString();
      const actualReceived = parseFloat(item.actual) || 0;
      
      // Find existing inventory record
      let existingRow = -1;
      for (let i = 1; i < inventoryData.length; i++) {
        if (inventoryData[i][stockNoIndex] && inventoryData[i][stockNoIndex].toString() === stockNo) {
          existingRow = i;
          break;
        }
      }

      if (existingRow > 0) {
        // Update existing inventory
        const currentQty = parseFloat(inventoryData[existingRow][qtyOnHandIndex]) || 0;
        const newQty = currentQty + actualReceived;
        inventorySheet.getRange(existingRow + 1, qtyOnHandIndex + 1).setValue(newQty);
        inventorySheet.getRange(existingRow + 1, lastUpdatedIndex + 1).setValue(timestamp);
        
        // Update total value
        const unitCostIndex = inventoryHeaders.indexOf("UNIT_COST");
        const totalValueIndex = inventoryHeaders.indexOf("TOTAL_VALUE");
        const unitCost = parseFloat(inventoryData[existingRow][unitCostIndex]) || 0;
        inventorySheet.getRange(existingRow + 1, totalValueIndex + 1).setValue(newQty * unitCost);
        
        // Update ABC classification
        updateABCClassification(existingRow + 1, inventorySheet, inventoryHeaders);
        
      } else {
        // Create new inventory record
        const newRow = [
          timestamp,
          stockNo,
          item.description,
          "MAIN", // Default location
          "A-01", // Default bin
          actualReceived,
          Math.max(1, Math.floor(actualReceived * 0.2)), // 20% buffer
          timestamp,
          calculateABCClassification(actualReceived, item.unitCost),
          calculateFSNClassification(actualReceived, item.unitCost),
          item.unitCost,
          actualReceived * item.unitCost,
          timestamp,
          "ACTIVE"
        ];
        inventorySheet.getRange(inventorySheet.getLastRow() + 1, 1, 1, newRow.length).setValues([newRow]);
      }
    }

    // Check for low stock alerts
    const lowStockAlerts = checkLowStockAlerts(inventorySheet, inventoryHeaders);
    
    return { 
      success: true, 
      message: "Inventory updated successfully",
      lowStockAlerts: lowStockAlerts
    };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Calculate ABC Classification based on unit cost and quantity
 */
function calculateABCClassification(quantity, unitCost) {
  const totalValue = quantity * unitCost;
  
  if (totalValue >= 10000) return "A";
  else if (totalValue >= 1000) return "B";
  else return "C";
}

/**
 * Calculate FSN (Fast, Slow, Non-moving) Classification
 */
function calculateFSNClassification(quantity, unitCost) {
  // Simplified FSN based on value and quantity
  const totalValue = quantity * unitCost;
  
  if (totalValue >= 5000 && quantity >= 10) return "F"; // Fast
  else if (totalValue >= 500) return "S"; // Slow
  else return "N"; // Non-moving
}

/**
 * Update ABC Classification for existing record
 */
function updateABCClassification(rowNumber, sheet, headers) {
  const qtyIndex = headers.indexOf("QTY_ON_HAND");
  const costIndex = headers.indexOf("UNIT_COST");
  const abcIndex = headers.indexOf("ABC_CLASSIFICATION");
  
  const qty = parseFloat(sheet.getRange(rowNumber, qtyIndex + 1).getValue()) || 0;
  const cost = parseFloat(sheet.getRange(rowNumber, costIndex + 1).getValue()) || 0;
  
  const abcClass = calculateABCClassification(qty, cost);
  sheet.getRange(rowNumber, abcIndex + 1).setValue(abcClass);
}

/**
 * Check for low stock alerts
 */
function checkLowStockAlerts(sheet, headers) {
  const data = sheet.getDataRange().getValues();
  const alerts = [];
  const qtyIndex = headers.indexOf("QTY_ON_HAND");
  const bufferIndex = headers.indexOf("BUFFER_LEVEL");
  const stockNoIndex = headers.indexOf("STOCK_NO");
  const descIndex = headers.indexOf("ITEM_DESCRIPTION");
  
  for (let i = 1; i < data.length; i++) {
    const qtyOnHand = parseFloat(data[i][qtyIndex]) || 0;
    const bufferLevel = parseFloat(data[i][bufferIndex]) || 0;
    
    if (qtyOnHand <= bufferLevel) {
      alerts.push({
        stockNo: data[i][stockNoIndex],
        description: data[i][descIndex],
        currentQty: qtyOnHand,
        bufferLevel: bufferLevel,
        status: qtyOnHand === 0 ? "OUT_OF_STOCK" : "LOW_STOCK"
      });
    }
  }
  
  return alerts;
}

/**
 * Generate RIS (Requisition and Issue Slip) Number
 */
function generateRISNumber() {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  const risSheet = ss.getSheetByName(RIS_SHEET_NAME);
  
  if (!risSheet) {
    return "RIS-001";
  }
  
  const data = risSheet.getDataRange().getValues();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const datePrefix = `RIS${year}${month}${day}`;
  
  let count = 1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().startsWith(datePrefix)) {
      count++;
    }
  }
  
  return `${datePrefix}-${count.toString().padStart(3, '0')}`;
}

/**
 * Process RIS (Requisition and Issue Slip) - Stock Out Logic
 */
function processRIS(formData) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const risSheet = ss.getSheetByName(RIS_SHEET_NAME);
    const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
    
    if (!risSheet || !inventorySheet) {
      return { success: false, error: "Required sheets not found" };
    }

    const timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
    const risNumber = generateRISNumber();
    
    // Process each item in RIS
    for (const item of formData.items) {
      const stockNo = item.stockNo.toString();
      const qtyToIssue = parseFloat(item.qtyIssued) || 0;
      
      // Check inventory availability
      const inventoryCheck = checkInventoryAvailability(stockNo, qtyToIssue);
      if (!inventoryCheck.available) {
        return { 
          success: false, 
          error: `Insufficient stock for ${stockNo}. Available: ${inventoryCheck.availableQty}, Requested: ${qtyToIssue}` 
        };
      }
      
      // Subtract from inventory
      const inventoryUpdate = subtractFromInventory(stockNo, qtyToIssue);
      if (!inventoryUpdate.success) {
        return inventoryUpdate;
      }
      
      // Add to RIS database
      const risRow = [
        timestamp,
        risNumber,
        formData.gsoidNumber || "",
        formData.department,
        formData.requestedBy,
        formData.dateRequested,
        new Date().toISOString().split('T')[0], // Date issued
        stockNo,
        item.description,
        item.unit,
        item.qtyRequested,
        item.qtyIssued,
        item.unitCost,
        (parseFloat(item.qtyIssued) * parseFloat(item.unitCost)) || 0,
        formData.purpose,
        item.remarks || "",
        "ISSUED"
      ];
      
      risSheet.getRange(risSheet.getLastRow() + 1, 1, 1, risRow.length).setValues([risRow]);
    }
    
    // Generate QR code for RIS
    const qrCodeUrl = generateQRCode(risNumber);
    
    return { 
      success: true, 
      risNumber: risNumber,
      qrCodeUrl: qrCodeUrl,
      message: "RIS processed successfully"
    };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Check inventory availability
 */
function checkInventoryAvailability(stockNo, requiredQty) {
  const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
  const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
  
  if (!inventorySheet) {
    return { available: false, availableQty: 0 };
  }
  
  const data = inventorySheet.getDataRange().getValues();
  const headers = data[0];
  const stockNoIndex = headers.indexOf("STOCK_NO");
  const qtyIndex = headers.indexOf("QTY_ON_HAND");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][stockNoIndex] && data[i][stockNoIndex].toString() === stockNo) {
      const availableQty = parseFloat(data[i][qtyIndex]) || 0;
      return {
        available: availableQty >= requiredQty,
        availableQty: availableQty
      };
    }
  }
  
  return { available: false, availableQty: 0 };
}

/**
 * Subtract from inventory when items are issued
 */
function subtractFromInventory(stockNo, qtyToSubtract) {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
    const timestamp = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd HH:mm:ss");
    
    const data = inventorySheet.getDataRange().getValues();
    const headers = data[0];
    const stockNoIndex = headers.indexOf("STOCK_NO");
    const qtyIndex = headers.indexOf("QTY_ON_HAND");
    const totalValueIndex = headers.indexOf("TOTAL_VALUE");
    const unitCostIndex = headers.indexOf("UNIT_COST");
    const lastUpdatedIndex = headers.indexOf("LAST_UPDATED");
    const statusIndex = headers.indexOf("STATUS");
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][stockNoIndex] && data[i][stockNoIndex].toString() === stockNo) {
        const currentQty = parseFloat(data[i][qtyIndex]) || 0;
        const newQty = currentQty - qtyToSubtract;
        const unitCost = parseFloat(data[i][unitCostIndex]) || 0;
        
        // Update quantity
        inventorySheet.getRange(i + 1, qtyIndex + 1).setValue(newQty);
        inventorySheet.getRange(i + 1, lastUpdatedIndex + 1).setValue(timestamp);
        
        // Update total value
        inventorySheet.getRange(i + 1, totalValueIndex + 1).setValue(newQty * unitCost);
        
        // Update status
        if (newQty <= 0) {
          inventorySheet.getRange(i + 1, statusIndex + 1).setValue("OUT_OF_STOCK");
        } else {
          inventorySheet.getRange(i + 1, statusIndex + 1).setValue("ACTIVE");
        }
        
        return { success: true };
      }
    }
    
    return { success: false, error: "Item not found in inventory" };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Generate QR Code for documents
 */
function generateQRCode(documentNumber) {
  // This would integrate with a QR code generation service
  // For now, return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${documentNumber}`;
}

/**
 * Get inventory status for dashboard - Low Stock Alerts
 */
function getInventoryStatus() {
  try {
    const ss = SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
    const inventorySheet = ss.getSheetByName(INVENTORY_SHEET_NAME);
    
    if (!inventorySheet) {
      return { success: false, error: "Inventory sheet not found" };
    }
    
    const data = inventorySheet.getDataRange().getValues();
    const headers = data[0];
    const qtyIndex = headers.indexOf("QTY_ON_HAND");
    const bufferIndex = headers.indexOf("BUFFER_LEVEL");
    const statusIndex = headers.indexOf("STATUS");
    
    let totalItems = 0;
    let activeItems = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;
    
    for (let i = 1; i < data.length; i++) {
      const qty = parseFloat(data[i][qtyIndex]) || 0;
      const buffer = parseFloat(data[i][bufferIndex]) || 0;
      const status = data[i][statusIndex] || "";
      
      totalItems++;
      
      if (status === "ACTIVE") activeItems++;
      if (qty <= buffer && qty > 0) lowStockItems++;
      if (qty <= 0) outOfStockItems++;
    }
    
    return {
      success: true,
      summary: {
        totalItems: totalItems,
        activeItems: activeItems,
        lowStockItems: lowStockItems,
        outOfStockItems: outOfStockItems,
        healthyItems: activeItems - lowStockItems - outOfStockItems
      },
      alerts: checkLowStockAlerts(inventorySheet, headers)
    };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
