import React, { useState } from 'react';
import  { Award, Medal, BookOpen, ChevronDown, ChevronUp, Star, Compass, Music, Trophy } from 'lucide-react';
import  { useSchoolData } from '../context/SchoolDataContext';
import ErrorState from '../components/ErrorState';
import Loading from '../components/Loading';

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("board");
  const { boardAchievers, otherAchievements, isLoading, error, refreshData } = useSchoolData();

  // For collapsible sections in Board Achievements (keys are academic years like "2024-25")
  const [expandedYears, setExpandedYears] = useState({
    "2024-25": true, // Default expanded
    "2023-24": false,
  });

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // Group board achievers by academic year
  const groupedBoardAchievers = boardAchievers.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {});

  // Sort years descending
  const sortedYears = Object.keys(groupedBoardAchievers).sort((a, b) =>
    b.localeCompare(a),
  );

  // Category Colors for other achievements
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "sports":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "science":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "cultural":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-emerald-50 text-school-primary border-emerald-100";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "sports":
        return Trophy;
      case "science":
        return Compass;
      case "cultural":
        return Music;
      default:
        return Star;
    }
  };

  return (
    <div className="fade-in bg-gray-50/40 min-h-screen">
      {/* Page Header */}
      <section
        className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90 flex items-center justify-center space-x-1.5">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span>Honors & Recognitions</span>
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Our Achievements & Milestones
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Celebrating the excellence, hard work, and athletic spirit displayed
            by our students across state and CBSE boards.
          </p>
        </div>
      </section>

      {/* Toggle Tab Switcher Container */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-2xl flex items-center space-x-1 w-full max-w-md">
            <button
              id="achievements-tab-board"
              onClick={() => setActiveTab("board")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "board"
                  ? "bg-white text-school-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Board Achievements</span>
            </button>
            <button
              id="achievements-tab-other"
              onClick={() => setActiveTab("other")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "other"
                  ? "bg-white text-school-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/50"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Other Achievements</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Stage */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loading size="lg" height="h-64" />
          ) : error ? (
            <ErrorState
              title="Unable to load Achievements"
              message={error}
              onRetry={refreshData}
            />
          ) : activeTab === "board" ? (
            // ================= BOARD ACHIEVEMENTS ACCORDION LIST =================
            <div className="space-y-6 max-w-5xl mx-auto">
              {sortedYears.map((year) => {
                const isExpanded = !!expandedYears[year];
                const achievers = groupedBoardAchievers[year];
                return (
                  <div
                    key={year}
                    className="bg-white rounded-3xl border border-gray-150/60 overflow-hidden shadow-sm"
                  >
                    {/* Collapsible Header */}
                    <button
                      id={`achievements-year-toggle-${year}`}
                      onClick={() => toggleYear(year)}
                      className="w-full flex justify-between items-center px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-school-primary/10 text-school-primary rounded-xl">
                          <Medal className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-sans font-bold text-lg sm:text-xl text-gray-900 leading-tight">
                            Academic Session {year}
                          </h3>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {achievers.length} Board Rank Toppers Highlighted
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {/* Collapsible Student Grid Content */}
                    {isExpanded && (
                      <div className="p-6 sm:p-8 bg-white border-t border-gray-100 animate-fadeIn">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                          {achievers
                            .sort((a, b) => a.rank - b.rank)
                            .map((topper) => (
                              <div
                                key={topper.id}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group text-center text-sm"
                              >
                                <div className="aspect-[3/4] relative bg-gray-50 overflow-hidden">
                                  <img
                                    src={topper.imageUrl}
                                    alt={topper.studentName}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                  />

                                  {/* Rank Indicator Medal */}
                                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-yellow-400 text-gray-950 font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                                    <Star className="h-3 w-3 fill-gray-950" />
                                    <span>Rank {topper.rank}</span>
                                  </div>
                                </div>
                                <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                                  <div>
                                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-school-primary transition-colors">
                                      {topper.studentName}
                                    </h4>
                                    <p className="text-gray-500 text-xs font-semibold mt-0.5">
                                      {topper.className} | {topper.stream}
                                    </p>
                                  </div>
                                  <div className="pt-2 border-t border-gray-50 flex flex-col items-center">
                                    <span className="text-school-primary font-black text-lg">
                                      {topper.percentage}%
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      CBSE Board Examination
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // ================= OTHER ACHIEVEMENTS TAGGED GRID =================
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {otherAchievements.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row group"
                  >
                    {/* Achievement Card Photo */}
                    {item.imageUrl && (
                      <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Achievement Details */}
                    <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(item.category)}`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{item.category}</span>
                          </span>
                          <span className="text-gray-400 text-xs font-medium">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg sm:text-xl leading-snug group-hover:text-school-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
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
