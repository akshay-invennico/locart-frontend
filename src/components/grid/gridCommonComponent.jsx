"use client";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Standard_Avatar from "@/components/grid/user";
import PhoneComponent from "./phoneComponent";
import DateFormateComponent from "./dateFormateComponent";
import CurrencyComponent from "./currencyComponent";
import BadgeComponent from "./badgeComponent";
import ActionComponent from "./actionComponent";
import TimeRangeCell from "../ui/timerangecell";

const GridCommonComponent = ({
  data = [],
  options = {},
  theme = {},
  columns,
  bulkActionsConfig = [],
}) => {
  const { select = false, order = false, sortable = false } = options;
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const fallbackImg = "/profile.jpg";

  useEffect(() => {
    if (data.length > 0) {
      setSelectAll(selectedRows.length === data.length);
    }
  }, [selectedRows, data.length]);

  const handleRowSelect = (rowIndex) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, index) => index));
    }
  };

  const toggleCardExpansion = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex);
  };

  const getNestedValue = (obj, path) => {
    if (typeof obj === "string" && typeof path === "object" && path !== null) {
      [obj, path] = [path, obj];
    }

    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (!path || typeof path !== "string") {
      return obj;
    }

    return path
      .split(".")
      .reduce((acc, part) => acc?.[part], obj);
  };

  const getSafeValue = (value, fallback = "-") => {
    // Handle undefined, null, or empty
    if (value === undefined || value === null || value === "") {
      return fallback;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map(item => getSafeValue(item)).join(", ");
    }

    // Handle objects
    if (typeof value === "object" && value !== null) {
      // Priority order for extracting string values from objects
      const extractionOrder = [
        'name', 'title', 'label', 'displayName',
        'text', 'value', '_id', 'id'
      ];

      for (const key of extractionOrder) {
        if (value[key] !== undefined && value[key] !== null) {
          // Recursive check in case the property is also an object
          if (typeof value[key] === "string") {
            return value[key];
          } else if (typeof value[key] === "number") {
            return String(value[key]);
          } else if (typeof value[key] === "object") {
            // Recursively get safe value
            const nestedValue = getSafeValue(value[key]);
            if (nestedValue !== fallback) {
              return nestedValue;
            }
          }
        }
      }

      // If no known property found, try to stringify safely
      try {
        const stringified = JSON.stringify(value);
        // Don't show empty objects
        if (stringified === '{}' || stringified === '[]') {
          return fallback;
        }
        return stringified;
      } catch (error) {
        console.warn("Error stringifying object:", error, value);
        return "[Complex Object]";
      }
    }
    return String(value);
  }

  const renderCellContent = (column, value, row) => {
    if (column?.render) {
      return column?.render(value, row);
    }

    // Recent activity Component using grid
    if (column.component?.type === "activity_cell") {
      const { profile, description, time } = value || {};

      return (
        <div className="flex items-start space-x-3">
          <img
            src={profile || fallbackImg}
            alt="User"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
            className={`${column.component.style.radius || "rounded-full"} ${column.component.style.size || "w-10 h-10"
              } ${column.component.style.border || ""}`}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium line-clamp-2">
              {description}
            </span>
            <span className="text-xs text-gray-500 mt-1">{time}</span>
          </div>
        </div>
      );
    }

    if (column.isObject) {
      const structuredData = {};
      if (column.structure) {
        Object.keys(column.structure).forEach((key) => {
          const path = column.structure[key];
          Object.assign(structuredData, (value || row));
          structuredData[key] = getNestedValue(value, path);
        });
      } else {
        Object.assign(structuredData, value);
      }

      if (column.component) {
        switch (column.component.type) {
          case "standard_avatar":
            return (
              <Standard_Avatar
                user={{
                  ...structuredData,
                  name: structuredData.name?.name || structuredData.name,
                }}
                {...column.component.props}
                style={column.component.style}
              />
            );
          default:
            break;
        }
      }

      return getSafeValue(structuredData);
    }

    if (column.component) {
      switch (column.component.type) {
        case "standard_avatar":
          return (
            <Standard_Avatar
              user={{ name: getSafeValue(value) }}
              {...column.component.props}
              style={column.component.style}
            />
          );
        case "phone":
          return (
            <PhoneComponent
              data={value}
              {...column.component.props}
              style={column.component.style}
            />
          );
        case "date":
          return (
            <DateFormateComponent
              data={value}
              {...column.component.options}
              style={column.component.style}
            />
          );
        case "currency":
          return (
            <CurrencyComponent
              data={value}
              {...column.component.options}
              style={column.component.style}
            />
          );
        case "badge":
          if (column.component?.options?.render) {
            return column.component.options.render(value, row);
          }
          return (
            <BadgeComponent
              data={value}
              {...column.component?.options}
              style={column.component?.style}
            />
          );

        case "action":
          return (
            <ActionComponent
              // data={value}
              data={row}
              {...column.component.options}
              style={column.component.style}
            />
          );

        case "timeRange":
          return (
            <TimeRangeCell
              row={row}
              fieldName={column.key}
              onChange={row.onChange}
            />
          );

        case "toggle":
          return (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={row?.active} // your row boolean
                onChange={() => row?.onToggle(row?.id)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary1 transition-colors">
                <span
                  className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
            ${row.active ? "translate-x-6" : "translate-x-0"}`}
                />
              </div>
            </label>
          );

        default:
          break;
      }
    }

    return getSafeValue(value);
  };

  // Desktop/Tablet Table View
  const renderTableView = () => (
    <div className="w-full">
      {/* Container with proper z-index management */}
      <div
        className={`w-full border rounded-lg overflow-hidden ${theme?.border || "border-gray-200"
          } bg-white`}
        style={{ position: "relative" }}
      >
        {/* Fixed header container */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full text-sm text-left">
              <thead
                className={`text-xs  ${theme?.header?.bg || "bg-gray-100"}`}
                style={{
                  display: theme?.hideHeader ? "none" : "table-header-group",
                }}
              >
                {/* checkbox on the left side in grid */}
                <tr>
                  {select && (
                    <th
                      scope="col"
                      className="px-2  py-3 whitespace-nowrap w-10"
                      style={{
                        left: 0,
                        zIndex: 21,
                        background: theme?.header?.bg || "#E4E4E6",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        // className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        className="w-4 h-4 rounded border border-gray-500
                        bg-white
                        checked:bg-primary1 
                        relative cursor-pointer
                        before:content-['✔'] before:absolute before:text-gray-300
                        checked:before:text-white before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                        appearance-none
                        flex items-center justify-center"
                      />
                    </th>
                  )}
                  {order && (
                    <th
                      scope="col"
                      className="px-2  py-3 whitespace-nowrap w-16 text-xs sm:text-sm text-gray-700"
                    >
                      Rank
                    </th>
                  )}
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`px-2  py-3 whitespace-nowrap text-xs sm:text-sm font-medium ${column.sortable || sortable
                        ? "cursor-pointer hover:bg-gray-200"
                        : ""
                        }`}
                    // onClick={() => handleSort(column.key, column)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{column.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b hover:bg-gray-50 transition-colors ${selectedRows.includes(rowIndex)
                      ? "bg-gray-100"
                      : "bg-white"
                      }`}
                  >
                    {select && (
                      <td
                        className="px-2 py-4 whitespace-nowrap"
                        style={{
                          left: 0,
                          zIndex: 10,
                          background: selectedRows.includes(rowIndex)
                            ? "#f3f4f6"
                            : "white",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(rowIndex)}
                          onChange={() => handleRowSelect(rowIndex)}
                          // className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          className="w-4 h-4 rounded border border-gray-500
                        bg-white
                        checked:bg-[#02C8DE] 
                        relative cursor-pointer
                        before:content-['✔'] before:absolute before:text-gray-400
                        checked:before:text-white before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                        appearance-none
                        flex items-center justify-center"
                        />
                      </td>
                    )}
                    {order && (
                      <td className="px-2  py-4 whitespace-nowrap text-xs sm:text-sm">
                        {rowIndex + 1}
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-2  py-4 whitespace-nowrap text-xs sm:text-sm
                          ${column.component?.style?.text || "text-gray-900"}
                        `}
                        style={{ minWidth: column.minWidth || "auto" }}
                      >
                        <div className="flex items-center justify-start max-w-xs lg:max-w-none ">
                          {/* {renderCellContent(column, row[column.key], row)} */}

                          {renderCellContent(
                            column,
                            column.component?.type === "action"
                              ? row
                              : row[column.key],
                            row
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Card View
  const renderCardView = () => (
    <div className="space-y-3 px-2 sm:px-4">
      {data.map((row, rowIndex) => {
        const isExpanded = expandedCard === rowIndex;
        const primaryColumn =
          columns.find((col) => col.isPrimary) || columns[0];

        return (
          <div
            key={rowIndex}
            className={`bg-white rounded-lg border ${theme?.border || "border-gray-200"
              }  shadow-sm ${selectedRows.includes(rowIndex)
                ? "ring-2 ring-indigo-500 ring-opacity-50"
                : ""
              }`}
          >
            {/* Card Header */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                {select && (
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={() => handleRowSelect(rowIndex)}
                    // className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                    className="w-4 h-4 rounded border border-gray-500
                        bg-white
                        checked:bg-primary1
                        relative cursor-pointer
                        before:content-['✔'] before:absolute before:text-gray-400
                        checked:before:text-white before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                        appearance-none
                        flex items-center justify-center"
                  />
                )}

                {order && (
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {rowIndex + 1}
                    </span>
                  </div>
                )}

                {/* Primary content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    {renderCellContent(
                      primaryColumn,
                      row[primaryColumn.key],
                      row
                    )}
                  </div>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleCardExpansion(rowIndex)}
                className={`ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ${
                  // Hide expand button if all non-primary columns are nonExpandable like activity_cell -- Activity section Component
                  columns.filter((col) => !col.isPrimary && !col.nonExpandable)
                    .length === 0
                    ? "hidden"
                    : ""
                  }`}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Expanded Card Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {columns // skip the nonExpandable columns
                    .filter(
                      (column) => !column.isPrimary && !column.nonExpandable
                    )
                    .map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className={`flex justify-between items-center py-1 sm:py-2 border-b border-gray-200 last:border-b-0 min-h-[2rem]
                        ${column.component?.style?.text}`}
                      >
                        <span className="text-xs sm:text-sm font-medium text-gray-600 flex-shrink-0 w-24 sm:w-32">
                          {column.title}
                        </span>
                        <div className="text-xs sm:text-sm text-gray-900 text-right flex-1 min-w-0 ml-2">
                          <div className="flex items-center justify-end w-full">
                            {renderCellContent(column, row[column.key], row)}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="w-full max-w-full ">
      {/* Tablet and Desktop view */}
      <div className="hidden sm:block">{renderTableView()}</div>

      {/* Mobile view (320px and up) */}
      <div className="block sm:hidden">
        {/* Mobile Header with Select All */}
        {select && (
          <div className="mb-3 mx-2 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                // className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                className="w-4 h-4 rounded border border-gray-500
                        bg-white
                        checked:bg-primary1
                        relative cursor-pointer
                        before:content-['✔'] before:absolute before:text-gray-400
                        checked:before:text-white before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                        appearance-none
                        flex items-center justify-center"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({selectedRows.length} selected)
              </span>
            </label>
          </div>
        )}

        {renderCardView()}
      </div>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="w-full mt-4 flex justify-center">
          <div className="w-full max-w-full bg-white border rounded-lg shadow-sm p-3 flex justify-center gap-8 items-center">
            {/* <ActionComponent */}

            {bulkActionsConfig.map((actionSet, index) => (
              <ActionComponent
                key={index}
                data={selectedRows.map((i) => data[i])}
                actions={[actionSet]}
                selectedRows={selectedRows.map((i) => data[i])}
                direct
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

GridCommonComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.shape({
    select: PropTypes.bool,
    order: PropTypes.bool,
    sortable: PropTypes.bool,
  }),
  theme: PropTypes.shape({
    border: PropTypes.string,
    header: PropTypes.shape({
      bg: PropTypes.string,
    }),
  }),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      isObject: PropTypes.bool,
      isPrimary: PropTypes.bool,
      sortable: PropTypes.bool,
      minWidth: PropTypes.string,
      structure: PropTypes.object,
      render: PropTypes.func,
      component: PropTypes.shape({
        type: PropTypes.string,
        variant: PropTypes.string,
        props: PropTypes.object,
        options: PropTypes.object,
        style: PropTypes.object,
      }),
    })
  ).isRequired,
  onSort: PropTypes.func,
  bulkActionsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconUrl: PropTypes.string,
      component: PropTypes.node,
      children: PropTypes.array,
    })
  ),
};

export default GridCommonComponent;
