import React from "react";
import Sidebar from "../common/SidebarComponent";
import { X } from "lucide-react";

import { useState } from "react";
import { AddServices } from "../modules/AddServices";
import DynamicForm from "../modules/registry";

const sampleConfig = {
  // title: "User Registration",
  formCss: {
    maxWidth: "500px",
    margin: "0 auto",
    // padding: "1px",
    // border: "1px solid #ddd",
    // borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    // backgroundColor: "#f9f9f9",
  },
  fields: [
    {
      type: "file",
      name: "serviceIcon",
      label: "Service Icon",
      containerCss: { marginBottom: "20px" },
      labelCss: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "5px",
      },
    },
    {
      type: "input",
      name: "Amount Range",
      label: "Amount",
      placeholder: "e.g., $160",
    },
  ],
};

export const AddAppointment = ({ isOpen, onClose }) => {
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
        <div className="w-full min-w-[400px]  ">
          <DynamicForm config={sampleConfig} />
        </div>
      </div>
    </Sidebar>
  );
};
