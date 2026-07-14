import React from "react";
import { X, Save } from "lucide-react";

export function UserModal({ userForm, setUserForm, handleCreateUser, setIsUserModalOpen }) {
  const handleChange = (field, val) => {
    setUserForm(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={() => setIsUserModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">Create Principal Account</h3>
        <p className="text-xs text-gray-500 -mt-3">
          Super Admin accounts cannot be created here — only through the initial server setup.
        </p>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Full Name</label>
            <input type="text" value={userForm.name || ""} onChange={e => handleChange("name", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
            <input type="email" value={userForm.email || ""} onChange={e => handleChange("email", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Password</label>
            <input type="password" value={userForm.password || ""} onChange={e => handleChange("password", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleCreateUser} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90">
            <Save className="h-4 w-4" />
            <span>Create Principal Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}