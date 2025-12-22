"use client";
import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}