import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

const ThumbnailListField = ({ field, formData, setFormData }) => {
  const currentImages = formData[field.name] || [];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>
      <div className="flex flex-wrap gap-2">
        {currentImages.length > 0 ? (
          currentImages.map((imgUrl, idx) => (
            <div key={idx} className="relative w-20 h-20 border rounded">
              <Image
                src={imgUrl}
                width={80}
                height={80}
                alt="Product Image"
                className="rounded object-cover w-full h-full"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md z-10"
                onClick={() => {
                  const newImages = currentImages.filter((_, i) => i !== idx);
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: newImages,
                  }));
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No images available</p>
        )}
      </div>
    </div>
  );
};

export default ThumbnailListField;
