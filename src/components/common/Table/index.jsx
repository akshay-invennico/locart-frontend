import React, { useState, useMemo, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Pagination from './Pagination';
import Toolbar from './Toolbar';
import { downloadCSV, downloadPDF } from './utils';

/**
 * @param {Array} columns
 * @param {Array} data
 * @param {string} title
 * @param {boolean} enableSearch
 * @param {boolean} enableDownload
 * @param {number} itemsPerPage
 * @param {string} emptyMessage
 */
const Table = ({
  columns = [],
  data = [],
  title = "Table",
  enableSearch = true,
  enableDownload = true,
  itemsPerPage = 10,
  emptyMessage = "No records found"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1);
  }, [data]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = data.filter(row => {
      return columns.some(col => {
        let cellData = row[col.accessor];
        if (col.accessor && col.accessor.includes('.')) {
          cellData = col.accessor.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, row);
        }

        return String(cellData || '').toLowerCase().includes(lowerQuery);
      });
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, data, columns]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV(data, columns, title.replace(/\s+/g, '-').toLowerCase());
  };

  const handleDownloadPDF = () => {
    downloadPDF(data, columns, title, title.replace(/\s+/g, '-').toLowerCase());
  };

  return (
    <div className="w-full bg-white">
      <Toolbar
        title={title}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={enableSearch}
        showDownload={enableDownload}
        onDownloadCSV={handleDownloadCSV}
        onDownloadPDF={handleDownloadPDF}
      />

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader columns={columns} />
          <TableBody
            data={currentData}
            columns={columns}
            emptyMessage={emptyMessage}
          />
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
