import React from "react";
import { Plus, Trash, Pencil } from "lucide-react";

export function AchievementsTab({ boardAchievers, otherAchievements, achievementSubTab, setAchievementSubTab, handleOpenAchieverModal, handleDeleteAchiever, handleOpenOtherAchModal, handleDeleteOtherAch }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Toppers & Achievements</h2>
          <p className="text-gray-500 text-xs mt-1">Manage Class X/XII toppers and school achievements.</p>
        </div>
        <div className="flex items-center space-x-2">
          {achievementSubTab === "board" ? (
            <button onClick={() => handleOpenAchieverModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
              <Plus className="h-4 w-4" />
              <span>Add Board Topper</span>
            </button>
          ) : (
            <button onClick={() => handleOpenOtherAchModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all">
              <Plus className="h-4 w-4" />
              <span>Add Achievement</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-100">
        <button onClick={() => setAchievementSubTab("board")} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${achievementSubTab === "board" ? "border-school-primary text-school-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}>Board Toppers</button>
        <button onClick={() => setAchievementSubTab("other")} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors ${achievementSubTab === "other" ? "border-school-primary text-school-primary" : "border-transparent text-gray-500 hover:text-gray-900"}`}>Other Achievements</button>
      </div>

      {achievementSubTab === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardAchievers.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500 text-sm font-medium">
              No board achievers found.
            </div>
          ) : (
            boardAchievers.map((ach) => (
              <div key={ach.id} className="border border-gray-100 p-4 rounded-2xl flex items-center space-x-4 relative group">
                <img src={ach.imageUrl} alt={ach.studentName} className="w-16 h-16 object-cover rounded-full border border-gray-150 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-gray-900">{ach.studentName}</p>
                  <p className="text-xs text-school-primary font-bold">{ach.className} | Rank #{ach.rank}</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{ach.percentage}%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Year {ach.year}</p>
                </div>
                <button
                  onClick={() => handleOpenAchieverModal(ach)}
                  className="absolute top-3 right-12 p-1.5 bg-white border border-gray-100 text-gray-400 hover:text-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteAchiever(ach.id)} className="absolute top-3 right-3 p-1.5 bg-white border border-gray-100 text-gray-400 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {otherAchievements.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm font-medium">
              No achievements found.
            </div>
          ) : (
            otherAchievements.map((oth) => (
              <div className="py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img
                    src={oth.imageUrl}
                    alt={oth.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      {oth.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Category: {oth.category} | Date: {oth.date}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {oth.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenOtherAchModal(oth)}
                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-gray-400 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDeleteOtherAch(oth.id)} className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
