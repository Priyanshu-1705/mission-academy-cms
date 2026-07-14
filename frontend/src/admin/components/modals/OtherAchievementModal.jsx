import React, { useState } from "react";
import {
  X,
  Save,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";

export function OtherAchModal({
  editingOtherAch,
  otherAchForm,
  setOtherAchForm,
  handleSaveOtherAch,
  setIsOtherAchModalOpen,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleChange = (field, value) => {
    setOtherAchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files (.png, .jpg, .jpeg) are allowed.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setFileError("File size exceeds 3MB limit.");
      return;
    }

    setFileError("");

    // Store the actual File object
    handleChange("image", file);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsOtherAchModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold text-gray-900">
          {editingOtherAch
            ? "Edit Achievement"
            : "Create Achievement"}
        </h3>

        <div className="space-y-4">

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Achievement Title
            </label>
            <input
              type="text"
              value={otherAchForm.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Category
            </label>

            <select
              value={otherAchForm.category || "Other"}
              onChange={(e) =>
                handleChange("category", e.target.value)
              }
              className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            >
              <option value="Sports">Sports</option>
              <option value="Science">Science</option>
              <option value="Cultural">Cultural</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Event Date
            </label>
            <input
              type="date"
              value={otherAchForm.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Description
            </label>
            <textarea
              value={otherAchForm.description || ""}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              rows={3}
              className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">
              Achievement Image
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-5 border-2 border-dashed rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-center gap-3 transition-colors ${isDragging
                  ? "border-school-primary bg-school-primary/5"
                  : "border-gray-200 hover:border-school-primary"
                }`}
            >
              <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                <Upload className="h-6 w-6" />
              </div>

              <div>
                <p className="text-gray-700 font-bold text-xs sm:text-sm">
                  Click to upload or drag and drop
                </p>

                <p className="text-gray-400 text-[10px] mt-0.5">
                  PNG, JPG, JPEG format, maximum 3MB size
                </p>
              </div>

              <label className="bg-school-primary hover:bg-school-primary/95 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all">
                <span>Browse File</span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {otherAchForm.image && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Image Preview
                </span>

                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center h-40">
                  <img
                    src={
                      otherAchForm.image instanceof File
                        ? URL.createObjectURL(otherAchForm.image)
                        : otherAchForm.image
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleChange("image", "")}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-emerald-600 text-xs font-bold flex items-center space-x-1.5 bg-emerald-50 py-1.5 px-2.5 rounded-lg border border-emerald-100">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>Image loaded successfully</span>
                </div>
              </div>
            )}

            {fileError && (
              <div className="text-red-500 text-xs font-bold flex items-center space-x-1.5 bg-red-50 py-1.5 px-2.5 rounded-lg border border-red-100">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsOtherAchModalOpen(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveOtherAch}
            className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90"
          >
            <Save className="h-4 w-4" />
            <span>Save Achievement</span>
          </button>
        </div>
      </div>
    </div>
  );
}