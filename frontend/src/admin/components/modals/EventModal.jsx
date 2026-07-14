import React from "react";
import { X, Save } from "lucide-react";

export function EventModal({ editingEvent, eventForm, setEventForm, handleSaveEvent, setIsEventModalOpen }) {
  const handleChange = (field, val) => {
    setEventForm(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button onClick={() => setIsEventModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">{editingEvent ? "Edit Event" : "Create Event"}</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Event Title</label>
            <input type="text" value={eventForm.title || ""} onChange={e => handleChange("title", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Date (YYYY-MM-DD)</label>
              <input type="date" value={eventForm.date || ""} onChange={e => handleChange("date", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">Time (e.g. 10:00 AM)</label>
              <input type="text" value={eventForm.time || ""} onChange={e => handleChange("time", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Venue</label>
            <input type="text" value={eventForm.venue || ""} onChange={e => handleChange("venue", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Description</label>
            <textarea value={eventForm.description || ""} onChange={e => handleChange("description", e.target.value)} className="w-full border border-gray-200 px-4 py-2 rounded-xl text-sm focus:outline-none" rows={3}></textarea>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
          <button onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSaveEvent} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90">
            <Save className="h-4 w-4" />
            <span>Save Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
