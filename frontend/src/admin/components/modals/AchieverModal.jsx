import React, { useState } from "react";
import { X, Save, Upload, Check, AlertCircle } from "lucide-react";

export function AchieverModal({ editingAchiever, achieverForm, setAchieverForm, handleSaveAchiever, setIsAchieverModalOpen }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleChange = (field, val) => {
    setAchieverForm(prev => ({ ...prev, [field]: val }));
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
    const file = e.target.files[0];
    processFile(file);
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
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsAchieverModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">{editingAchiever ? "Edit Board Topper" : "Create Board Topper"}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Student Name</label>
            <input type="text" value={achieverForm.studentName || ""} onChange={e => handleChange("studentName", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Class (Class X / XII)</label>
              <input type="text" value={achieverForm.className || ""} onChange={e => handleChange("className", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Percentage (e.g. 98.2%)</label>
              <input type="text" value={achieverForm.percentage || ""} onChange={e => handleChange("percentage", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Rank</label>
              <input
                type="number"
                min="1"
                value={achieverForm.rank || ""}
                onChange={e => handleChange("rank", e.target.value)}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Year</label>
              <input type="text" value={achieverForm.year || ""} onChange={e => handleChange("year", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
            </div>
          </div>

          {achieverForm.className === "Class XII" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Stream</label>
              <select
                value={achieverForm.stream || ""}
                onChange={e => handleChange("stream", e.target.value)}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
              >
                <option value="">Select stream...</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
          )}

          {/* Student Photo Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">Student Photo</label>
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
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Local Student Photo Preview */}
            {achieverForm.image && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Image Preview</span>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center h-40">
                  <img
                    src={
                      achieverForm.image instanceof File
                        ? URL.createObjectURL(achieverForm.image)
                        : achieverForm.image
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange("image", "")}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-md transition-colors"
                    title="Remove Image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-emerald-600 text-xs font-bold px-1 flex items-center space-x-1.5 bg-emerald-50 py-1.5 px-2.5 rounded-lg border border-emerald-100">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Student photo loaded successfully</span>
                </div>
              </div>
            )}

            {fileError && (
              <div className="text-red-500 text-xs font-bold px-1 flex items-center space-x-1.5 bg-red-50 py-1.5 px-2.5 rounded-lg border border-red-100">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button onClick={() => setIsAchieverModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveAchiever} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90">
            <Save className="h-4 w-4" />
            <span>Save Topper</span>
          </button>
        </div>
      </div>
    </div>
  );
}
