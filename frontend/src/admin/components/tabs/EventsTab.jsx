import React from "react";
import { Plus, Trash, Search, Calendar, Edit } from "lucide-react";

export function EventsTab({ eventSearch, setEventSearch, filteredEvents, handleOpenEventModal, handleDeleteEvent }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Event Calendar & News</h2>
          <p className="text-gray-500 text-xs mt-1">Manage school events and bulletin alerts.</p>
        </div>
        <button onClick={() => handleOpenEventModal()} className="inline-flex items-center space-x-2 bg-school-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all shrink-0">
          <Plus className="h-4 w-4" />
          <span>Add School Event</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={eventSearch}
            onChange={(e) => setEventSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredEvents?.map((event) => (
          <div
            key={event.id}
            className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-gray-900">
                    {event.title}
                  </p>

                  <span className="px-2 py-0.5 rounded-full bg-school-primary/10 text-school-primary text-[10px] font-bold uppercase tracking-wide">
                    {event.category || "General"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {event.date} | {event.time} | Venue: {event.venue}
                </p>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                onClick={() => handleOpenEventModal(event)}
                className="p-1.5 hover:bg-school-bg hover:text-school-primary rounded-lg text-gray-400 transition-colors"
                title="Edit Event"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors"
                title="Delete Event"
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
