import React, { useState } from "react";
import { Input } from "../ui/input";
import { X } from "lucide-react";

const CreatePortfolio = ({ onSubmit, onClose, open }) => {
  const [albumName, setAlbumName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleSubmit = () => {
    if (!albumName.trim()) return alert("Album name is required!");

    const formData = new FormData();
    formData.append("name", albumName);
    formData.append("description", description);

    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    onSubmit(formData);

    setAlbumName("");
    setDescription("");
    setImageFiles([]);
    setPreviewImages([]);

    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-2xl">Add Photos</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <h2 className="text-[#7B7B7B] mb-3">Upload your salon's photos to showcase your work in the LocArt gallery.</h2>

        <hr className="mb-4" />

        <form className="space-y-4">

          <label htmlFor="albumName">Album Name</label>
          <Input
            type="text"
            placeholder="Album Name"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            className="w-full border px-3 py-2 rounded-[6px] mt-2"
          />

          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded-[6px] h-28 resize-none"
          />

          <label htmlFor="gallery">Gallery Photos</label>
          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition mt-2">
            <p className="text-gray-600">Upload or drag files here</p>
            <p className="text-xs text-gray-400 mt-1">Max 20 images</p>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="preview"
                  className="w-full h-28 object-cover rounded-[6px] border"
                />
              ))}
            </div>
          )}

          <div className="q-full flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              className="w-full px-4 py-2 bg-primary1 text-white rounded-lg hover:bg-primary1/90"
              onClick={handleSubmit}
            >
              Add Album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolio;
