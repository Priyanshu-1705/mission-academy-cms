import React, { useState, useEffect } from "react";
import { X, Save, Upload, Check, AlertCircle } from "lucide-react";

export function TransferCertificateModal({
  editingTc,
  tcForm,
  setTcForm,
  handleSaveTc,
  setIsTcModalOpen
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (tcForm.pdf instanceof File) {
      setFileName(tcForm.pdf.name);
    } else if (tcForm.pdfUrl) {
      setFileName("uploaded_certificate.pdf");
    } else {
      setFileName("");
    }

    setFileError("");
  }, [tcForm]);

  const handleChange = (field, val) => {
    setTcForm(prev => ({ ...prev, [field]: val }));
  };

  const processFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF documents are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setFileError("File size exceeds 2MB limit.");
      return;
    }

    setFileError("");
    setFileName(file.name);

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

  const handleSave = () => {
    if (!tcForm.studentName?.trim()) {
      setFileError("Student Name is required.");
      return;
    }
    if (!tcForm.admissionNumber?.trim()) {
      setFileError("Admission Number is required.");
      return;
    }
    if (!tcForm.pdf && !editingTc) {
      setFileError("Please upload a PDF Transfer Certificate file.");
      return;
    }

    handleSaveTc();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={() => setIsTcModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {editingTc ? "Edit / Replace Transfer Certificate" : "Upload Transfer Certificate"}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">
            Provide the details and PDF document of the school transfer certificate.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Admission No.</label>
              <input
                type="text"
                value={tcForm.admissionNumber || ""}
                onChange={e => handleChange("admissionNumber", e.target.value)}
                placeholder="e.g. 101"
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Student Name</label>
              <input
                type="text"
                value={tcForm.studentName || ""}
                onChange={e => handleChange("studentName", e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
              />
            </div>
          </div>

          {/* Dotted Upload Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase">PDF Document File</label>
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
                  Drag & Drop PDF file here
                </p>
                <p className="text-gray-400 text-[10px] mt-0.5">
                  Only PDF format, maximum 2MB size
                </p>
              </div>
              <label className="bg-school-primary hover:bg-school-primary/95 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shadow-sm transition-all">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Filename status */}
            {fileName && (
              <div className="text-emerald-600 text-xs font-bold px-1 flex items-center space-x-1.5 bg-emerald-50 py-1.5 px-2.5 rounded-lg border border-emerald-100">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Attached: {fileName}</span>
              </div>
            )}

            {/* File Error */}
            {fileError && (
              <div className="text-red-500 text-xs font-bold px-1 flex items-center space-x-1.5 bg-red-50 py-1.5 px-2.5 rounded-lg border border-red-100">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsTcModalOpen(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90 cursor-pointer transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
