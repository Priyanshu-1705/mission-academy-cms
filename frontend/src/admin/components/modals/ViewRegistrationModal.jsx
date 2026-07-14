import React from "react";
import { X } from "lucide-react";

export function ViewRegModal({ viewingReg, setIsViewRegModalOpen }) {
  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button onClick={() => setIsViewRegModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Student Registration Details</h3>
          <p className="text-xs text-gray-500 mt-1 font-mono">ID: {viewingReg.id}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Student Full Name</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.studentName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date of Birth</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.dob || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Gender</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.gender}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Class Applied</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.classApplied}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Previous School</p>
            <p className="font-medium text-gray-900 mt-0.5">{viewingReg.previousSchool || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Father's Name</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.fatherName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Mother's Name</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.motherName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Parent Phone</p>
            <p className="font-extrabold text-gray-900 mt-0.5">{viewingReg.parentPhone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</p>
            <p className="font-medium text-gray-900 mt-0.5">{viewingReg.email || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Address</p>
            <p className="font-medium text-gray-900 mt-0.5">{viewingReg.address}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Submitted</p>
            <p className="font-medium text-gray-900 mt-0.5">{viewingReg.createdAt ? new Date(viewingReg.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</p>
            <p className="font-extrabold text-indigo-600 uppercase mt-0.5">{viewingReg.status}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button onClick={() => setIsViewRegModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}