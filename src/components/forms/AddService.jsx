import React from "react";
import Sidebar from "../common/SidebarComponent";
import { X } from "lucide-react";

import { useState } from "react";
import { AddServices } from "../modules/AddServices";

export const AddService = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleClose = () => {
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Sidebar isOpen={isOpen} onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold ">Service</h1>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AddServices />
      </div>
    </Sidebar>
  );
};
