import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

/**
 * @param {Array} data
 * @param {Array} columns
 * @param {string} fileName
 */
export const downloadCSV = (data, columns, fileName = 'table-data') => {
  if (!data || !data.length) return;

  const headers = columns.map(col => col.header).join(',');

  const rows = data.map(row =>
    columns.map(col => {
      let cellData = row[col.accessor];

      if (col.accessor.includes('.')) {
        cellData = col.accessor.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : '', row);
      }

      if (typeof cellData === 'object' && cellData !== null) {
        return `"${JSON.stringify(cellData).replace(/"/g, '""')}"`;
      }
      return `"${String(cellData || '').replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

/**
 * @param {Array} data
 * @param {Array} columns
 * @param {string} title
 * @param {string} fileName
 */
export const downloadPDF = (data, columns, title = 'Table Data', fileName = 'table-data') => {
  if (!data || !data.length) return;

  const doc = new jsPDF();

  const tableColumn = columns.map(col => col.header);
  const tableRows = [];

  data.forEach(row => {
    const rowData = columns.map(col => {
      let cellData = row[col.accessor];
      if (col.accessor.includes('.')) {
        cellData = col.accessor.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : '', row);
      }
      return cellData || '';
    });
    tableRows.push(rowData);
  });

  doc.text(title, 14, 15);
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 163, 74] }
  });

  doc.save(`${fileName}.pdf`);
};
