import React from "react";
import { X, Save } from "lucide-react";

export function RegModal({ editingReg, regForm, setRegForm, handleSaveReg, setIsRegModalOpen }) {
  const handleChange = (field, val) => {
    setRegForm(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={() => setIsRegModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">{editingReg ? "Edit Registration" : "Create Registration"}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Student Name</label>
            <input type="text" value={regForm.studentName || ""} onChange={e => handleChange("studentName", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Date of Birth</label>
              <input type="date" value={regForm.dob || ""} onChange={e => handleChange("dob", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Gender</label>
              <select value={regForm.gender || "Male"} onChange={e => handleChange("gender", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Class Applied</label>
              <input type="text" value={regForm.classApplied || ""} onChange={e => handleChange("classApplied", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Previous School</label>
              <input type="text" value={regForm.previousSchool || ""} onChange={e => handleChange("previousSchool", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Father's Name</label>
              <input type="text" value={regForm.fatherName || ""} onChange={e => handleChange("fatherName", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Mother's Name</label>
              <input type="text" value={regForm.motherName || ""} onChange={e => handleChange("motherName", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Parent Phone</label>
              <input type="text" value={regForm.parentPhone || ""} onChange={e => handleChange("parentPhone", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Email</label>
              <input type="email" value={regForm.email || ""} onChange={e => handleChange("email", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Address</label>
            <textarea value={regForm.address || ""} onChange={e => handleChange("address", e.target.value)} rows={2} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>

          {editingReg && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Status</label>
              <select value={regForm.status || "pending"} onChange={e => handleChange("status", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none bg-white">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button onClick={() => setIsRegModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveReg} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90">
            <Save className="h-4 w-4" />
            <span>Save Registration</span>
          </button>
        </div>
      </div>
    </div>
  );
}