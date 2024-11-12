import { Workbook } from 'exceljs';

// Read the existing Excel file
async function addRowToExcelFile(filename, sheetName, rowData) {
    // Create a new workbook instance
    const workbook = new Workbook();

    try {
        // Read the existing Excel file
        await workbook.xlsx.readFile(filename);

        // Access the specified worksheet by name
        let worksheet = workbook.getWorksheet(sheetName);
        
        // Check if the worksheet exists, if not, create it
        if (!worksheet) {
        worksheet = workbook.addWorksheet(sheetName);
        }

        // Add a single row to the worksheet
        worksheet.addRow(rowData);

        // Save the updated workbook to the same file
        await workbook.xlsx.writeFile(filename);

        console.log('Row added successfully!');
    } catch (error) {
        console.error('Error reading or writing file:', error);
    }
}
