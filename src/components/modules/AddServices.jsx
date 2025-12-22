import React, { useState } from "react";
import DynamicForm from "./DynamicFormRendering";

// Example configuration
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
      name: "serviceName",
      label: "Service Name",
      placeholder: "e.g., Loc Retwist",
    },
    {
      type: "input",
      name: "basedprice",
      label: "Based Price",
      placeholder: "e.g., $160",
    },

    {
      type: "textarea",
      name: "description",
      label: "Description",
      placeholder: "Enter description...",
      richText: true,
    },
  ],
};

// Example usage
export const AddServices = () => {
  return (
    <div className="w-full min-w-[400px]  ">
      <DynamicForm config={sampleConfig} />
    </div>
  );
};
