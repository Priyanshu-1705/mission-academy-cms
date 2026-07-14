import React from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Pencil } from "lucide-react";

export function LeadershipTab({ leaders, handleOpenLeaderModal, handleDeleteLeader, handleReorderLeader }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Leadership Messages</h2>
            <span className="bg-school-primary/10 text-school-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Super Admin Only
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Manage school managers and principals messages displayed on the homepage.</p>
        </div>
        <button onClick={() => handleOpenLeaderModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
          <Plus className="h-4 w-4" />
          <span>Add Leader</span>
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {leaders.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm font-medium">
            No leadership messages found.
          </div>
        ) : (
          leaders.map((leader, index) => (
            <div key={leader.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={leader.photoUrl}
                  alt={leader.name}
                  className="w-16 h-16 object-cover rounded-full border border-gray-150 shrink-0"
                />
                <div>
                  <p className="font-bold text-sm text-gray-900">{leader.name}</p>
                  <p className="text-xs text-school-primary font-bold">{leader.designation}</p>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{leader.message}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <button onClick={() => handleReorderLeader(leader.id, "up")} disabled={index === 0} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => handleReorderLeader(leader.id, "down")} disabled={index === leaders.length - 1} className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenLeaderModal(leader)}
                  className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteLeader(leader.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
