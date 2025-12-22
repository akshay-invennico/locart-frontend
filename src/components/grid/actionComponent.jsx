"use client";
import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PopupForm from "../ui/popupform";

const ActionComponent = ({
  data,
  style,
  actions = [],
  icon,
  buttonClassName,
  direct = false,
  selectedRows = [], // use for selected bulk action
  ...options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();

  // Evaluate actions if it's a function
  const evaluatedActions =
    typeof actions === "function" ? actions(data) : actions || [];

  const toggleMenu = () => {
    // If only one action and it is a sidebar with no label, open sidebar directly
    if (
      evaluatedActions.length === 1 &&
      evaluatedActions[0]?.type === "sidebar" &&
      !evaluatedActions[0]?.label
    ) {
      setContent(evaluatedActions[0]?.component);
      setContentType("sidebar");
      setSidebarOpen(true);
      return;
    }

    // Otherwise, toggle dropdown
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action) => {
    // Navigate action
    if (action.type === "navigate" && action.url) {
      let finalUrl = "";

      // If url is a function → call it with row data
      if (typeof action.url === "function") {
        finalUrl = action.url(data);
      }
      // If url is a string → replace :id
      else if (typeof action.url === "string") {
        finalUrl = action.url.replace(":id", data?.id || "");
      }

      router.push(finalUrl);
      setIsOpen(false);
      return;
    }

    // Store the action for later use
    setCurrentAction(action);

    // Handle popup with config (for bulk actions)
    if (action.type === "popUp" && action.popupConfig) {
      setContentType("popUp");
      setPopUpOpen(true);
      setIsOpen(false);
      return;
    }

    // Handle component-based popup/sidebar (legacy)
    if (action.component) {
      const comp =
        typeof action.component === "function"
          ? action.component(data)
          : action.component;
      setContent(comp);
      setContentType(action.type || "popUp");

      if (action.type === "sidebar") {
        setSidebarOpen(true);
      } else {
        setPopUpOpen(true);
      }
    }

    // Direct onClick handler
    if (action.onClick) {
      action.onClick(data);
    }

    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const renderIcon = (action) => {
    if (action.iconUrl) {
      return (
        <Image src={action.iconUrl} alt={action.label} width={16} height={16} />
      );
    }
    return null;
  };

  const closeAll = () => {
    setSidebarOpen(false);
    setPopUpOpen(false);
    setContent(null);
    setCurrentAction(null);
  };

  return (
    <>
      <div style={style} className="relative inline-block">
        {direct ? (
          <div className="flex gap-4">
            {evaluatedActions?.map((action, index) => {
              const hasDropdown =
                action?.children && action?.children?.length > 0;
              return (
                <div key={action.label || index} className="relative">
                  <button
                    onClick={() => {
                      if (hasDropdown) setIsOpen((prev) => !prev);
                      else handleActionClick(action);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                    style={{ color: "#02C8DE" }}
                  >
                    {action?.iconUrl && (
                      <img
                        src={action?.iconUrl}
                        alt={action?.label}
                        className="w-4 h-4"
                      />
                    )}
                    {action?.label}
                  </button>

                  {/* Dropdown for Export Selection */}
                  {hasDropdown && isOpen && (
                    <div
                      ref={menuRef}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white border rounded-md shadow-lg z-50"
                    >
                      {action.children.map((child, idx) =>
                        child.header ? (
                          <div
                            key={child.header || idx}
                            className="px-3 py-2 text-xs text-gray-500 font-medium"
                          >
                            {child.header}
                          </div>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(child)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600"
                            style={{ color: "#02C8DE" }}
                          >
                            <div className="flex flex-row gap-2">
                              {child.icon && (
                                <span className="flex items-center">
                                  {child.icon}
                                </span>
                              )}
                              <span className="text-[#7B7B7B]">
                                {child.label}
                              </span>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // fallback for old 3-dot behavior
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className={`focus:outline-none ${
              buttonClassName || "p-1 rounded-full hover:bg-gray-100"
            }`}
          >
            {icon || <EllipsisVertical className="w-5 h-5" />}
            {options.text && (
              <span className="text-sm font-medium">{options.text}</span>
            )}
          </button>
        )}

        {/* Dropdown Menu (3-dot) */}
        {!direct && isOpen && evaluatedActions.length > 0 && (
          <div
            ref={menuRef}
            className="absolute right-0 z-[100] mt-2 w-56 origin-top-right rounded-md bg-white shadow-xl"
            role="menu"
          >
            <div className="py-1 overflow-y-auto max-h-60">
              {evaluatedActions?.map((action, index) => {
                if (action.header) {
                  return (
                    <div
                      key={action.header}
                      className="px-4 py-2 text-xs text-gray-500 font-medium tracking-wide"
                    >
                      {action.header}
                    </div>
                  );
                }

                return (
                  <button
                    key={action.label}
                    onClick={() => handleActionClick(action)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-1 text-sm hover:bg-blue-50
                      ${action.style?.color ? "" : "text-[#7B7B7B]"}`}
                    style={{ color: action.style?.color }}
                    role="menuitem"
                  >
                    {renderIcon(action)}
                    {action.icon && (
                      <span className="mr-2 flex items-center">
                        {action.icon}
                      </span>
                    )}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PopUp - NEW: Handle both component and config-based popups */}
      {popUpOpen && contentType === "popUp" && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-60"
            onClick={closeAll}
          ></div>
          <div
            className="relative bg-white rounded-lg shadow-xl mx-4 my-8 overflow-auto z-[1001]"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              width: "auto",
              minWidth: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {(() => {
                const providedOnApply = content.props?.onApply;
                const providedOnCancel = content.props?.onCancel;
                return React.cloneElement(content, {
                  data,
                  onApply: (formData, ...rest) => {
                    if (typeof providedOnApply === "function") {
                      providedOnApply(formData, data, ...rest);
                    }
                    setPopUpOpen(false);
                  },
                  onCancel: (...args) => {
                    if (typeof providedOnCancel === "function") {
                      providedOnCancel(...args);
                    }
                    setPopUpOpen(false);
                  },
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {sidebarOpen && contentType === "sidebar" && content && (
        <div className="fixed inset-0 z-[1000] overflow-hidden">
          <div
            className="absolute inset-0 bg-black opacity-60"
            onClick={closeAll}
          ></div>
          <div className="absolute inset-y-0 right-0 flex">
            <div className="relative h-full">
              <div
                className={`flex flex-col bg-white shadow-xl transform transition-all duration-300 ease-in-out rounded-lg m-2 border border-[#E4E4E6] ${
                  sidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
                style={{
                  maxWidth: "600px",
                  height: "calc(100vh - 2rem)",
                  margin: "1rem",
                }}
              >
                <div className="flex-1 overflow-y-auto max-w-[800px] p-4">
                  <button
                    onClick={closeAll}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={25} />
                  </button>
                  {(() => {
                    const providedOnApply = content.props?.onApply;
                    const providedOnCancel = content.props?.onCancel;
                    return React.cloneElement(content, {
                      data,
                      onApply: (formData, ...rest) => {
                        if (typeof providedOnApply === "function") {
                          providedOnApply(formData, data, ...rest);
                        }
                        closeAll();
                      },
                      onCancel: (...args) => {
                        if (typeof providedOnCancel === "function") {
                          providedOnCancel(...args);
                        }
                        closeAll();
                      },
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionComponent;
