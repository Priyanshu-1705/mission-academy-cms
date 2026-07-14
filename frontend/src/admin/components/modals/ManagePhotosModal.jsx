import React, { useState } from "react";
import { X, Plus, Trash, Upload, Check, AlertCircle } from "lucide-react";

export function PhotosModal({
  managingAlbum,
  setIsManagePhotosModalOpen,
  newPhotoUrl,
  setNewPhotoUrl,
  newPhotoCaption,
  setNewPhotoCaption,
  handleModalAddPhoto,
  handleModalDeletePhoto
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  if (!managingAlbum) return null;

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

    // Store the File object instead of Base64
    setNewPhotoUrl(file);
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
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button onClick={() => setIsManagePhotosModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <div className="shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Manage Album Photos</h3>
          <p className="text-xs text-gray-500 mt-1 font-bold text-school-primary">Album: {managingAlbum.title}</p>
        </div>

        {/* Add photo inline form */}
        <div className="space-y-3 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-700 uppercase block">Add New Photo</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2 space-y-3">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-4 border-2 border-dashed rounded-xl bg-white flex flex-col items-center justify-center text-center gap-2 transition-colors ${isDragging
                  ? "border-school-primary bg-school-primary/5"
                  : "border-gray-200 hover:border-school-primary"
                  }`}
              >
                <Upload className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-700 font-bold text-xs">
                    Click or drag & drop to select photo
                  </p>
                  <p className="text-gray-400 text-[9px] mt-0.5">
                    PNG, JPG, JPEG (Max 3MB)
                  </p>
                </div>
                <label className="bg-school-primary hover:bg-school-primary/95 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Optional Caption Field */}
              <input
                type="text"
                placeholder="Photo Caption / Description (Optional)"
                value={newPhotoCaption || ""}
                onChange={e => setNewPhotoCaption(e.target.value)}
                className="w-full border border-gray-200 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-school-primary/20 bg-white"
              />

              {fileError && (
                <div className="text-red-500 text-[11px] font-bold px-1 flex items-center space-x-1.5 bg-red-50 py-1 px-2 rounded border border-red-100">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>

            {/* Photo Preview & Add Button */}
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center h-24">
                {newPhotoUrl ? (
                  <>
                    <img
                      src={
                        newPhotoUrl instanceof File
                          ? URL.createObjectURL(newPhotoUrl)
                          : newPhotoUrl
                      }
                      alt="New Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPhotoUrl("")}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded shadow transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 uppercase">No file chosen</span>
                )}
              </div>

              <button
                onClick={handleModalAddPhoto}
                disabled={!newPhotoUrl}
                className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all w-full ${newPhotoUrl
                  ? "bg-school-primary text-white hover:bg-opacity-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo list */}
        <div className="flex-grow overflow-y-auto divide-y divide-gray-100 min-h-[150px]">
          {managingAlbum.photos?.map((photo, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={photo.url || photo} alt="" className="w-16 h-12 object-cover rounded border border-gray-150" />
                <p className="text-xs text-gray-500 font-medium truncate max-w-md">{photo.caption || photo.url || photo}</p>
              </div>
              <button onClick={() => handleModalDeletePhoto(photo.id || i)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg">
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 shrink-0">
          <button onClick={() => setIsManagePhotosModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200">Done</button>
        </div>
      </div>
    </div>
  );
}
