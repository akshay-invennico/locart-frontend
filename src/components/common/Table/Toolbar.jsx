import React from 'react';
import { Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

const Toolbar = ({
  searchQuery,
  onSearchChange,
  onDownloadCAD,
  onDownloadPDF,
  title,
  showSearch = true,
  showDownload = true
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showSearch && (
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {showDownload && (
          <div className="relative">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 border border-[#02C8DE] bg-white rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 text-[#02C8DE]" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 min-w-[150px] bg-white rounded-md shadow-lg border border-gray-100 p-1 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                  sideOffset={5}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={onDownloadCAD}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer w-full text-left"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                      Export CSV
                    </button>
                    <button
                      onClick={onDownloadPDF}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer w-full text-left"
                    >
                      <FileText className="mr-2 h-4 w-4 text-red-600" />
                      Export PDF
                    </button>
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        )}
      </div>
    </div>
  );
};
const ToolbarWrapper = (props) => {
  return <Toolbar {...props} onDownloadCAD={props.onDownloadCSV} />
}

export default ToolbarWrapper;
