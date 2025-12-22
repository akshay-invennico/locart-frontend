import React, { useState } from "react";
import DynamicForm from "./DynamicFormRendering";

// Example configuration
const filterConfig = {
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
      name: "serviceName",
      label: "Service Name",
      placeholder: "e.g., Loc Retwist",
    },
    {
      type: "select",
      name: "userType",
      label: "User Type",
      options: [
        { value: "admin", label: "Administrator" },
        { value: "user", label: "Regular User" },
        { value: "guest", label: "Guest" },
      ],
      css: {
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
        fontSize: "16px",
        backgroundColor: "white",
      },
      labelCss: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "5px",
      },
    },
  ],
};

// Example usage
export const Registry = () => {
  return (
    <div className="w-full min-w-[400px]">
      <DynamicForm config={filterConfig} />
    </div>
  );
};

export default DynamicForm;
