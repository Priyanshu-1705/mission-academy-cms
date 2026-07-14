import React, { useState, useEffect } from "react";
import { X, Save, Upload, Check, AlertCircle, FileText } from "lucide-react";

export function DocModal({ editingDoc, docForm, setDocForm, handleSaveDoc, setIsDocModalOpen }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (docForm.pdf instanceof File) {
      setFileName(docForm.pdf.name);
    } else if (docForm.pdfUrl) {
      setFileName("uploaded_document.pdf");
    } else {
      setFileName("");
    }

    setFileError("");
  }, [docForm]);

  const handleChange = (field, val) => {
    setDocForm(prev => ({ ...prev, [field]: val }));
  };

  const processFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF documents are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit.");
      return;
    }

    setFileError("");
    handleChange("pdf", file);
    setFileName(file.name);
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

  const handleRemoveFile = () => {
    handleChange("pdf", "");
    handleChange("pdfUrl", "");
    setFileName("");
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsDocModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">{editingDoc ? "Edit Document" : "Upload Document"}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Document Title</label>
            <input type="text" value={docForm.title || ""} onChange={e => handleChange("title", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Category</label>
              <select
                value={docForm.category || "general_information"}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
              >
                <option value="general_information">
                  General Information
                </option>

                <option value="documents_information">
                  Documents & Information
                </option>

                <option value="results_academics">
                  Results & Academics
                </option>

                <option value="staff_infrastructure">
                  Staff & Infrastructure
                </option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Regulatory Code</label>
              <input type="text" value={docForm.documentCode || ""}
                onChange={(e) => handleChange("documentCode", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20" />
            </div>
          </div>

          {/* PDF File Upload Zone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">PDF Document</label>
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
                  PDF format only, maximum 5MB size
                </p>
              </div>
              <label className="bg-school-primary hover:bg-school-primary/95 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all">
                <span>Browse File</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Document Attached Status with Icon & Remove Option */}
            {fileName && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Attached Document</span>
                <div className="flex items-center justify-between bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-850 truncate">{fileName}</p>
                      <p className="text-[9px] text-emerald-600 font-medium">Ready to save</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                    title="Remove Document"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
          <button onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveDoc} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90">
            <Save className="h-4 w-4" />
            <span>Save Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
