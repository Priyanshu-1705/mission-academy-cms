import React from "react";
import { Check, Trash } from "lucide-react";

export function EnquiriesTab({ enquiries, handleToggleEnquiry, handleDeleteEnquiryStatus }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact Form Enquiries</h2>
        <p className="text-gray-500 text-xs mt-1">View and respond to direct feedback or inquiry tickets submitted from the public site.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {enquiries?.map((enq) => (
          <div key={enq.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-sm text-gray-900">{enq.name}</p>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${enq.status === "read" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-700"
                  }`}>
                  {enq.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{enq.email} | {enq.phone} | {new Date(enq.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100/60 mt-1 max-w-2xl">{enq.message}</p>
            </div>
            <div className="flex items-center space-x-2 self-end md:self-auto">
              <button onClick={() => handleToggleEnquiry(enq.id, enq.status)} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500" title="Toggle Read Status">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => handleDeleteEnquiryStatus(enq.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors" title="Delete">
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
