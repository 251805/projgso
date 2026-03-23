// Debug script to check Google Sheets structure
// Run this in the browser console of your Google Sheet

function debugSheetStructure() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  console.log("=== SPREADSHEET DEBUG INFO ===");
  console.log("Spreadsheet ID:", ss.getId());
  console.log("Total Sheets:", sheets.length);
  
  sheets.forEach((sheet, index) => {
    console.log(`\n--- Sheet ${index + 1}: ${sheet.getName()} ---`);
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length > 0) {
      const headers = values[0];
      console.log("Headers:", headers);
      console.log("Header Count:", headers.length);
      
      // Check for GSOID# and PR# columns
      const gsoidIndex = headers.indexOf("GSOID#");
      const prIndex = headers.indexOf("PR#");
      
      console.log("GSOID# column found:", gsoidIndex !== -1 ? `YES (position ${gsoidIndex + 1})` : "NO");
      console.log("PR# column found:", prIndex !== -1 ? `YES (position ${prIndex + 1})` : "NO");
      
      // Show first few rows of data
      const sampleRows = values.slice(0, Math.min(3, values.length));
      console.log("Sample Data:");
      sampleRows.forEach((row, rowIndex) => {
        console.log(`Row ${rowIndex + 1}:`, row);
      });
    } else {
      console.log("Sheet is empty");
    }
  });
}

// Run this function to check structure
debugSheetStructure();
