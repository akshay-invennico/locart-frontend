import React from 'react';
import { cn } from '@/lib/utils';

const TableHeader = ({ columns }) => {
  return (
    <thead className="bg-[#F8F8F8] border-b border-gray-100">
      <tr>
        {columns.map((col, index) => (
          <th
            key={col.accessor || index}
            className={cn(
              "px-4 py-2 text-left text-[14px] font-medium text-black capitalize tracking-wider",
              col.className
            )}
          >
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
