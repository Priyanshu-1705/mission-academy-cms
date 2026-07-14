import React from "react";
import { Plus, Trash, Pencil, Search, FileText, Download, FileUp } from "lucide-react";

export function TransferCertificatesTab({
  certificates,
  tcSearch,
  setTcSearch,
  filteredCertificates,
  handleOpenTcModal,
  handleDeleteTc
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transfer Certificate (T.C.) Management</h2>
          <p className="text-gray-500 text-xs mt-1">
            Publish, edit, and replace student transfer certificates linked to their registered admission codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk Import Button - styled consistently but disabled/greyed out with "Coming Soon" */}
          <button
            disabled
            className="inline-flex items-center space-x-2 bg-gray-100 text-gray-400 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-not-allowed"
            title="Bulk import feature coming soon"
          >
            <FileUp className="h-4 w-4" />
            <span>Bulk Import (Coming Soon)</span>
          </button>
          <button
            onClick={() => handleOpenTcModal()}
            className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-opacity-90 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Certificate</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search certificates by admission number or student name..."
          value={tcSearch}
          onChange={(e) => setTcSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
        />
      </div>

      {/* Table/List */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left text-sm divide-y divide-gray-100">
          <thead>
            <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Admission Number</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCertificates && filteredCertificates.length > 0 ? (
              filteredCertificates.map((tc) => (
                <tr key={tc.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center space-x-2.5">
                    <div className="p-1.5 bg-red-50 text-red-500 rounded-lg shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span>{tc.studentName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono bg-gray-100 text-gray-600 font-bold text-xs px-2.5 py-1 rounded-md border border-gray-200">
                      {tc.admissionNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 font-medium">
                    {new Date(tc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {tc.pdfUrl && (
                        <a
                          href={tc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-lg transition-colors inline-block"
                          title="View / Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleOpenTcModal(tc)}
                        className="p-1.5 hover:bg-school-bg hover:text-school-primary text-gray-400 rounded-lg transition-colors cursor-pointer"
                        title="Edit / Replace"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTc(tc.id)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No matching transfer certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
