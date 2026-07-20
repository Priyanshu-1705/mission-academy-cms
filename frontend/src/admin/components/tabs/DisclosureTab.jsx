import React from "react";
import { Plus, Trash, FileText, Pencil } from "lucide-react";

export function DisclosureTab({ disclosures, handleOpenDocModal, handleDeleteDisclosure }) {
  const CATEGORY_LABELS = {
    general_information: "General Information",
    documents_information: "Documents & Information",
    results_academics: "Results & Academics",
    staff_infrastructure: "Staff & Infrastructure"
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Mandatory Disclosure Docs</h2>
            <span className="bg-school-primary/10 text-school-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Super Admin Only
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Manage affiliation certificates, trust deeds, fire, building safety and fee structures.</p>
        </div>
        <button onClick={() => handleOpenDocModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
          <Plus className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {disclosures?.map((doc) => (
          <div key={doc.id} className="py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500">{CATEGORY_LABELS[doc.category] || doc.category} | Code: {doc.documentCode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenDocModal(doc)}
                className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit Document"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDeleteDoc(doc.id)}
                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete Document"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
