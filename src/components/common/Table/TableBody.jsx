import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TableBody = ({ data, columns, emptyMessage = "No data found" }) => {
  if (!data || data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-100">
      {data.map((row, rowIndex) => (
        <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
          {columns.map((col, colIndex) => {
            let cellData = row[col.accessor];
            if (col.accessor && col.accessor.includes('.')) {
              cellData = col.accessor.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, row);
            }

            return (
              <td
                key={`${rowIndex}-${col.accessor || colIndex}`}
                className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-700", col.className)}
              >
                {col.render ? col.render(row) : (cellData !== null && cellData !== undefined ? cellData : '-')}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
