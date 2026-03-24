# RIS (REQUISITION & ISSUE SLIP) TESTING GUIDE

## 🎯 **OVERVIEW**
The RIS module is fully implemented and ready for testing. This guide provides step-by-step instructions for testing the complete requisition workflow.

## 📋 **TESTING REQUIREMENTS**

### **Prerequisites**
1. **Admin Access**: Login with password "admin"
2. **Inventory Setup**: Ensure items exist in INVENTORY_MASTER sheet
3. **Spreadsheet Access**: Verify all sheets are accessible

### **Test Data Preparation**
Before testing, ensure you have inventory items:
```
Example Inventory Data:
- Stock No: IT-001, Description: Laptop Mouse, Unit: pcs, Qty: 50, Unit Cost: 150.00
- Stock No: OF-002, Description: Office Chair, Unit: pcs, Qty: 20, Unit Cost: 2500.00
- Stock No: ST-003, Description: Stapler, Unit: pcs, Qty: 100, Unit Cost: 85.00
```

## 🧪 **STEP-BY-STEP TESTING**

### **Step 1: Access RIS Module**
1. Open web app: https://script.google.com/macros/s/AKfycbxhUbLMEAXzSzfYR7a6EI5ImbJkzcLrfFLBTmfkZyr4/exec
2. Login as Admin (password: admin)
3. Click "4. REQUISITION (RIS)" in navigation
4. **Expected Result**: Purple theme interface with RIS form

### **Step 2: Create New RIS**
1. Click "CREATE NEW RIS" button
2. **Expected Result**: 
   - Empty state disappears
   - RIS form appears
   - RIS Number auto-generated (format: RIS20260324-001)
   - Current date populated

### **Step 3: Fill RIS Information**
1. **Department**: Enter "IT Department"
2. **Requested By**: Enter "John Doe"
3. **Purpose**: Enter "Office Equipment for New Hire"
4. **Date Requested**: Should auto-populate with today's date
5. **Expected Result**: All fields filled correctly

### **Step 4: Add Items**
1. Click "Add Item" button
2. Fill first item:
   - Stock No: "IT-001"
   - Description: "Laptop Mouse"
   - Unit: "pcs"
   - Qty Requested: "5"
   - Qty Issued: "5"
   - Unit Cost: "150.00"
3. **Expected Result**: 
   - Total cost auto-calculates (5 × 150.00 = 750.00)
   - Item count updates to "1"
   - Total cost shows "750.00"

### **Step 5: Add Multiple Items**
1. Click "Add Item" again
2. Fill second item:
   - Stock No: "OF-002"
   - Description: "Office Chair"
   - Unit: "pcs"
   - Qty Requested: "2"
   - Qty Issued: "2"
   - Unit Cost: "2500.00"
3. **Expected Result**:
   - Second item total: 5,000.00
   - Overall total: 5,750.00
   - Item count: "2"

### **Step 6: Submit RIS**
1. Click "Submit RIS" button
2. **Expected Result**:
   - Button shows "PROCESSING..."
   - System validates inventory availability
   - Success message: "RIS processed successfully! RIS Number: RIS20260324-001"
   - QR code opens in new tab (if available)
   - Form resets to empty state

### **Step 7: Verify Database Updates**
1. Check RIS_DATABASE sheet in Google Sheets
2. **Expected Result**:
   - New RIS record with all details
   - Status: "ISSUED"
   - Date Issued: Current date

### **Step 8: Verify Inventory Updates**
1. Check INVENTORY_MASTER sheet
2. **Expected Result**:
   - IT-001 quantity reduced by 5 (from 50 to 45)
   - OF-002 quantity reduced by 2 (from 20 to 18)
   - Last Updated timestamp updated
   - Total Value recalculated

## ⚠️ **ERROR TESTING SCENARIOS**

### **Test 1: Insufficient Stock**
1. Try to issue more than available quantity
2. **Expected Result**: 
   - Error message: "Insufficient stock for IT-001. Available: 45, Requested: 50"
   - RIS not processed
   - Form remains filled for correction

### **Test 2: Missing Required Fields**
1. Submit RIS without filling all required fields
2. **Expected Result**:
   - Empty fields highlighted in red
   - Alert: "Please fill in all required fields."
   - Submission blocked

### **Test 3: Invalid Stock Number**
1. Use non-existent stock number
2. **Expected Result**:
   - Error message: "Item not found in inventory"
   - RIS not processed

## 🔧 **TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Issue 1: RIS Number Not Generated**
- **Cause**: Connection to Apps Script failed
- **Solution**: Refresh page and try again

#### **Issue 2: Items Not Adding**
- **Cause**: JavaScript error in form
- **Solution**: Check browser console for errors

#### **Issue 3: Submit Button Disabled**
- **Cause**: Form validation failed
- **Solution**: Fill all required fields marked with red border

#### **Issue 4: Inventory Not Updated**
- **Cause**: RIS_DATABASE or INVENTORY_MASTER sheets missing
- **Solution**: Run `setupSheet()` function in Apps Script editor

## 📊 **SUCCESS CRITERIA**

### **Functional Requirements**
- ✅ RIS Number auto-generation works
- ✅ Form validation works correctly
- ✅ Inventory availability checking works
- ✅ Stock deduction works accurately
- ✅ Database updates correctly
- ✅ QR code generation works
- ✅ Error handling works properly

### **User Experience**
- ✅ Interface responsive and intuitive
- ✅ Loading states work correctly
- ✅ Error messages clear and helpful
- ✅ Success confirmations displayed
- ✅ Form resets properly after submission

## 🎯 **EXPECTED OUTCOMES**

After successful testing, the RIS module should:
1. **Streamline Requisitions**: Digital process replaces paper forms
2. **Maintain Inventory Accuracy**: Real-time stock updates
3. **Provide Audit Trail**: Complete RIS history in database
4. **Enable Quick Access**: QR codes for document linking
5. **Prevent Stockouts**: Availability checking prevents over-issuance

## 📞 **SUPPORT**

If any issues occur during testing:
1. Check browser console for JavaScript errors
2. Verify Apps Script deployment is active
3. Confirm spreadsheet permissions are correct
4. Review function logs in Apps Script editor

---

**Testing Status**: Ready for User Acceptance Testing (UAT)
**Next Phase**: Production deployment after successful testing
