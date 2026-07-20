import React, { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, Trophy, Compass, Heart, Award } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';
import usePageTitle from "../hooks/usePageTitle";

export default function Events() {
  usePageTitle("Events");
  const { events, isLoading, error, refreshData } = useSchoolData();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const categories = [
    { value: "all", label: "All Events" },
    { value: "academic", label: "Academic Exams" },
    { value: "sports", label: "Sports & Games" },
    { value: "cultural", label: "Arts & Culture" },
    { value: "holiday", label: "School Holidays" },
    { value: "general", label: "General Assemblies" },
  ];

  const filteredEvents = (
    selectedFilter === "all"
      ? events
      : events.filter((e) => e.category === selectedFilter)
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "academic":
        return "bg-emerald-50 text-school-primary border-emerald-100";
      case "sports":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "cultural":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "holiday":
        return "bg-sky-50 text-sky-600 border-sky-100";
      default:
        return "bg-purple-50 text-purple-600 border-purple-100";
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "academic":
        return BookOpen;
      case "sports":
        return Trophy;
      case "cultural":
        return Compass;
      case "holiday":
        return Heart;
      default:
        return Award;
    }
  };

  return (
    <div className="fade-in bg-gray-50/50 min-h-screen pb-16">
      {/* Page Header */}
      <section
        className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90 flex items-center justify-center space-x-1.5">
            <Calendar className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span>Institutional Planner</span>
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Academic Calendar & Events
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Stay informed about upcoming academic activities, cultural programs,
            sports competitions, school holidays, and other important announcements.
          </p>
        </div>
      </section>

      {/* Categories Filter Strip */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`events-filter-${cat.value}`}
              onClick={() => setSelectedFilter(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${selectedFilter === cat.value
                ? "bg-school-primary text-white shadow-sm shadow-school-primary/10"
                : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200/80"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Events List Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loading size="lg" height="h-48" />
          ) : error ? (
            <ErrorState
              title="Unable to load Calendar Events"
              message={error}
              onRetry={refreshData}
            />
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3 shadow-xs">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-gray-700 font-bold text-lg animate-pulse">
                No Events Scheduled
              </h3>
              <p className="text-gray-500 text-sm">
                There are no upcoming events listed inside this category at the
                moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((evt) => {
                const Icon = getCategoryIcon(evt.category);
                const eventDate = new Date(evt.date);
                const day = eventDate.getDate();
                const month = eventDate
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase();
                const year = eventDate.getFullYear();

                return (
                  <div
                    key={evt.id}
                    className="bg-white rounded-2xl border border-gray-150/60 p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start"
                  >
                    {/* Left Date Block */}
                    <div className="flex sm:flex-col items-center justify-center bg-school-primary text-white rounded-2xl p-4 w-full sm:w-20 text-center shrink-0 shadow-sm shadow-school-primary/15">
                      <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                        {day}
                      </span>
                      <span className="text-xs sm:text-sm font-bold tracking-widest uppercase mt-0.5">
                        {month}
                      </span>
                      <span className="text-[10px] sm:text-xs text-school-bg/80 leading-none mt-1 hidden sm:block">
                        {year}
                      </span>
                    </div>

                    {/* Right Event Info Content */}
                    <div className="space-y-3 flex-grow w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(evt.category)}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="uppercase tracking-wider">
                            {evt.category}
                          </span>
                        </span>
                        {evt.time && (
                          <span className="text-gray-400 text-xs font-semibold flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{evt.time}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-gray-950 font-bold text-lg sm:text-xl leading-tight">
                        {evt.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {evt.description}
                      </p>

                      {evt.venue && evt.venue !== "N/A" && (
                        <div className="pt-2 flex items-center space-x-1.5 text-xs text-gray-500 font-semibold">
                          <MapPin className="h-4 w-4 text-school-primary" />
                          <span>{evt.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
