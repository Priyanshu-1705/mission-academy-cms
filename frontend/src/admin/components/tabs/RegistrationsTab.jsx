import React from "react";
import { Eye, Trash, Search, Check, X } from "lucide-react";

export function RegistrationsTab({ regSearch, setRegSearch, filteredRegistrations, handleOpenRegModal, handleUpdateRegStatus, handleDeleteRegStatus, setViewingReg, setIsViewRegModalOpen }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Admission Registrations</h2>
        <p className="text-gray-500 text-xs mt-1">View, track and approve online admission registration submissions.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidates by name or phone..."
          value={regSearch}
          onChange={(e) => setRegSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm divide-y divide-gray-100">
          <thead>
            <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Parent / Phone</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRegistrations?.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-gray-900">{reg.studentName}</td>
                <td className="py-3.5 px-4">
                  <p className="text-gray-800">{reg.fatherName}</p>
                  <p className="text-xs text-gray-500">{reg.parentPhone}</p>
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-700">{reg.classApplied}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${reg.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      reg.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                    }`}>
                    {reg.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right flex items-center justify-end space-x-1">
                  <button onClick={() => { setViewingReg(reg); setIsViewRegModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleUpdateRegStatus(reg.id, "approved")} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="Approve">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleUpdateRegStatus(reg.id, "rejected")} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg" title="Reject">
                    <X className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteRegStatus(reg.id)} className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-lg" title="Delete">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
