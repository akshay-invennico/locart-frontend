"use client";

import { useEffect } from "react";

const Sidebar = ({ isOpen, onClose, children }) => {
  // Close on `Esc` press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 flex">
        <div
          className={`h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out min-w-[400px] w-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
