import * as XLSX from 'xlsx';

export class ExcelUtil {
  /**
   * Export data to Excel file
   * @param data - Array of objects to export
   * @param fileName - Name for the Excel file (will be used as header/sheet name)
   */
  static exportToExcel(data: any[], fileName: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create worksheet from data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns based on content
    const columnWidths: any[] = [];
    const headers = Object.keys(data[0]);
    
    headers.forEach((header, index) => {
      let maxLength = header.length;
      data.forEach((row: any) => {
        const cellValue = row[header]?.toString() || '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      columnWidths.push({ wch: Math.min(maxLength + 2, 50) }); // Max width 50
    });
    
    ws['!cols'] = columnWidths;

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);

    // Generate filename with current date
    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const fullFileName = `${fileName}_${dateStr}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fullFileName);
  }

  /**
   * Export data to Excel file with custom column widths
   * @param data - Array of objects to export
   * @param fileName - Name for the Excel file (will be used as header/sheet name)
   * @param columnWidths - Array of column widths {wch: number}
   */
  static exportToExcelWithCustomWidths(data: any[], fileName: string, columnWidths: { wch: number }[]): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create worksheet from data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Set custom column widths
    ws['!cols'] = columnWidths;

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);

    // Generate filename with current date
    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const fullFileName = `${fileName}_${dateStr}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fullFileName);
  }
}
