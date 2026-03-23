/**
 * CHUCKGPT UNIFIED PROCUREMENT & DELIVERY SYSTEM - V6.2
 * Master Spreadsheet: 1lZ9hV64nqiINeazlljKPUrgD46MKr5CQLuz1qqkS-6g
 * Logic: Combined Procurement (Blue) and Delivery (Green) modules.
 * UPDATED: GSOID# now serves as main system ID, PR# is optional field.
 * NO CODE SHORTCUTS - FULL SCRIPT DELIVERY MANDATE.
 */

// --- GLOBAL CONFIGURATION ---
const MASTER_SPREADSHEET_ID = "1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U";
const PR_SHEET_NAME = "PR_DATABASE";
const DR_SHEET_NAME = "DR_DATABASE";

// Folder & Template IDs - Purchase
const FOLDER_ID_PURCHASE = "1jxg9bn923U15yW2D9jzJKP9bca6YCu9k";
const TEMPLATE_ID_PURCHASE = "1tzgj1HuQeJP4ncfSg3apb2lJl7L2H1cgNTOyHWty6fM";

// Folder & Template IDs - Delivery
const FOLDER_ID_DELIVERY = "16wD0f3u4KRmVKWLw8HpFBRWtsWLESSF4";
const TEMPLATE_ID_DELIVERY = "1YNBVvFUO2Dk1SiiXvefQ99T9lB3XzaV1ryo6fBsIpJI";

// Price List Link
const PRICELIST_LINK = "https://script.google.com/macros/s/AKfycbz1409i5Ry5It81dcmBAwPN7_X20GeaQ4AgsP2OOzisLkD2ue6mSqgBIL7-heFg5vtc/exec";

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('GSO Procurement & Delivery')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
 * Initializes the master sheet structure
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
  return "System Initialized";
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
 * MODULE 2: Process Delivery Sync
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
    const docUrl = createDeliveryDoc(formData, drRows);
    return { success: true, gsoidNumber: formData.gsoidNumber, prNumber: formData.prNumber || "", docUrl: docUrl };
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