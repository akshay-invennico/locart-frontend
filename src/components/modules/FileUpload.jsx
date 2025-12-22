import React, { useState, useId, useEffect } from "react";
import { LuGalleryVertical, LuX } from "react-icons/lu";
import Image from "next/image";

const FileUpload = ({ onChange, value, multiple = false }) => {
  const [files, setFiles] = useState([]);
  const inputId = useId();

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFiles(value);
      } else {
        setFiles([value]);
      }
    } else {
      setFiles([]);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    validateAndSetFiles(newFiles);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(newFiles);
  };

  const validateAndSetFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => file.size <= 2 * 1024 * 1024);

    if (validFiles.length !== newFiles.length) {
      alert("Some files were skipped because they exceed 2MB");
    }

    if (validFiles.length > 0) {
      if (multiple) {
        const updatedFiles = [...files, ...validFiles];
        onChange(updatedFiles);
      } else {
        onChange(validFiles[0]);
      }
    }
  };

  const removeFile = (indexStr) => {
    const index = parseInt(indexStr, 10);
    if (multiple) {
      const updatedFiles = files.filter((_, i) => i !== index);
      onChange(updatedFiles);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition mb-4 relative"
      >
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          multiple={multiple}
        />

        <label
          htmlFor={inputId}
          className="flex flex-col items-center space-y-2 cursor-pointer"
        >
          <div className="w-12 h-12 border rounded flex items-center justify-center text-gray-400">
            <LuGalleryVertical />
          </div>
          <span className="text-gray-600">
            Upload or drop {multiple ? "files" : "a file"} right here
          </span>
          <span className="text-xs text-gray-400">
            (File Format - PNG, JPEG, Max 2MB)
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {files.map((file, index) => {
            const previewUrl = file instanceof File ? URL.createObjectURL(file) : null;

            return (
              <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt={`preview-${index}`}
                      fill
                      className="object-cover"
                      onLoadingComplete={() => {
                        URL.revokeObjectURL(previewUrl);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-xs text-gray-500 break-all p-1">
                    {file.name || "File"}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(index);
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition"
                >
                  <LuX size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
