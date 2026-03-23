# GSOID# Verification Instructions

## How to Check if GSOID# is in Your Google Sheet

### Method 1: Using the Debug Script (Recommended)

1. **Open your Google Sheet** at: https://docs.google.com/spreadsheets/d/1KeXiQZnlENkDKX9EggL5YFdFXdwbmIzDle1DepMbJ4U/edit

2. **Open Script Editor**:
   - Click **Extensions** > **Apps Script**
   - Or go directly to: https://script.google.com/d/1IhKetOMESuTqk9yss-oqB3YMl1j0LDvbPwGfi2KLVa-WK5Lji2wq6MZi/edit

3. **Create New Script**:
   - Click **+ New Project**
   - Paste the content from `debug-sheets.js`
   - Save the project

4. **Run the Debug Script**:
   - Select **debugSheetStructure** function from the dropdown
   - Click **Run**
   - Check the **Execution log** for results

### Method 2: Manual Sheet Inspection

1. **Open your Google Sheet**
2. **Check Column Headers**:
   - Look for **GSOID#** in column 5 (E)
   - Look for **PR#** in column 6 (F)
   - Headers should be: `["Timestamp", "DEPARTMENT", "DATE", "SECTION", "GSOID#", "PR#", "REMARKS", "BUDGET#", "BAC#", "REQUESTED_BY", "STOCK_NO", "UNIT", "ITEM_DESCRIPTION", "QTY", "UNIT_COST", "TOTAL_COST", "ACTUAL_RECEIVED", "NOTES"]`

### Method 3: Run Update Function

If GSOID# column is missing, run the update function:

1. **In Apps Script Editor**, create a new function:
```javascript
function runUpdate() {
  const result = updateSheetStructure();
  Logger.log(result);
  return result;
}
```

2. **Save and run** the `runUpdate` function

### Expected Results

When properly configured, you should see:

✅ **PR_DATABASE Sheet Headers:**
- Column 1: Timestamp
- Column 2: DEPARTMENT  
- Column 3: DATE
- Column 4: SECTION
- Column 5: **GSOID#** ⭐
- Column 6: **PR#** ⭐
- Column 7: REMARKS
- Column 8: BUDGET#
- Column 9: BAC#
- Column 10: REQUESTED_BY
- etc...

✅ **DR_DATABASE Sheet Headers:**
- Column 1: Timestamp
- Column 2: **GSOID#** ⭐
- Column 3: **PR#** ⭐  
- Column 4: DEPARTMENT
- etc...

### Troubleshooting

**If GSOID# is not visible:**
1. Check if the sheet was created before the update
2. Run `updateSheetStructure()` function
3. Refresh the browser page
4. Check for hidden columns (might need to unhide)

**If PR# is not visible:**
1. Same steps as GSOID# check
2. The PR# column should be immediately after GSOID#

### Verification Commands

The system includes these verification functions:

- `checkSheetStructure()` - Returns detailed sheet information
- `updateSheetStructure()` - Updates existing sheets to GSOID# format
- `testGSOIDGeneration()` - Tests GSOID# generation

### Current System Status

- **Version**: v6.2
- **GSOID# Format**: GSO MMDDYY-XXX (e.g., GSO032126-001)
- **PR# Status**: Optional field (can be empty)
- **Database**: PR_DATABASE and DR_DATABASE both updated

---

**Repository**: https://github.com/251805/projgso.git  
**Last Updated**: Complete GSOID# implementation with verification tools
