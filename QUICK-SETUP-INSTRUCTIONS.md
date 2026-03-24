# 🚀 QUICK SETUP INSTRUCTIONS

## ⚡ **PROBLEM SOLVED**
The `SETUP-SPREADSHEET-ID.js` script conflicts with existing Code.gs constants.
**Solution**: Use the standalone setup script.

## 📋 **QUICK SETUP STEPS**

### **Step 1: Create New Apps Script Project**
1. Go to: https://script.google.com
2. Click **New Project**
3. Delete any existing code in the editor

### **Step 2: Copy Standalone Script**
Copy the entire content from `STANDALONE-SETUP.js` and paste it into the new Apps Script project.

### **Step 3: Run Setup**
1. Select `standaloneSetup` from the dropdown
2. Click **Run**
3. Check the **Execution log** for results

### **Step 4: Verify Results**
Look for this in the execution log:
```
=== STANDALONE SPREADSHEET SETUP ===
Spreadsheet Name: Your Spreadsheet Name
Spreadsheet ID: 1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U
Spreadsheet URL: https://docs.google.com/spreadsheets/d/1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U/edit
Status: Spreadsheet is accessible and ready
Active Sheet: Sheet Name
Existing Sheets: PR_DATABASE, DR_DATABASE, INVENTORY_MASTER, RIS_DATABASE
Missing Sheets: (or list of created sheets)
```

## 🎯 **WHAT THE SCRIPT DOES**

### **Verification**
- ✅ **Checks spreadsheet access** with ID: `1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U`
- ✅ **Tests basic functionality** of the spreadsheet
- ✅ **Logs detailed results** for verification

### **Sheet Creation**
- ✅ **PR_DATABASE** - Purchase requests (Blue theme)
- ✅ **DR_DATABASE** - Delivery records (Green theme)  
- ✅ **INVENTORY_MASTER** - Live inventory (Orange theme)
- ✅ **RIS_DATABASE** - Requisition slips (Purple theme)

### **Headers Added**
Each sheet gets proper headers with color coding:
- **PR_DATABASE**: Timestamp, DEPARTMENT, DATE, SECTION, GSOID#, PR#, REMARKS, BUDGET#, BAC#, REQUESTED_BY, STOCK_NO, UNIT, ITEM_DESCRIPTION, QTY, UNIT_COST, TOTAL_COST, ACTUAL_RECEIVED, NOTES
- **DR_DATABASE**: Timestamp, GSOID#, PR#, DEPARTMENT, DATE, SECTION, REMARKS, BUDGET#, BAC#, REQUESTED_BY, STOCK_NO, UNIT, ITEM_DESCRIPTION, QTY_PURCHASED, UNIT_COST, TOTAL_COST, ACTUAL_RECEIVED, NOTES
- **INVENTORY_MASTER**: Timestamp, STOCK_NO, ITEM_DESCRIPTION, LOCATION, BIN, QTY_ON_HAND, BUFFER_LEVEL, LAST_COUNT_DATE, ABC_CLASSIFICATION, FSN_CLASSIFICATION, UNIT_COST, TOTAL_VALUE, LAST_UPDATED, STATUS
- **RIS_DATABASE**: Timestamp, RIS_NUMBER, GSOID#, DEPARTMENT, REQUESTED_BY, DATE_REQUESTED, DATE_ISSUED, STOCK_NO, ITEM_DESCRIPTION, UNIT, QTY_REQUESTED, QTY_ISSUED, UNIT_COST, TOTAL_COST, PURPOSE, REMARKS, STATUS

## ✅ **SUCCESS INDICATORS**

### **Setup Complete When You See:**
- ✅ **"Success: true"** in execution log
- ✅ **Spreadsheet name and URL** displayed
- ✅ **All 4 sheets** listed as existing or created
- ✅ **No error messages** in the log

### **After Setup:**
1. **Close the standalone Apps Script project**
2. **Return to your main GSO system**
3. **Test the web app** - the JavaScript error should be resolved

---

## 🎉 **QUICK FIX SUMMARY**

**Problem**: `SyntaxError: Identifier 'PR_SHEET_NAME' has already been declared`

**Solution**: Use standalone setup script in separate Apps Script project

**Result**: Spreadsheet configured with all required sheets, no more conflicts

**🚀 Just copy the standalone script to a new Apps Script project and run it!**
