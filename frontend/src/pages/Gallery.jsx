import React from "react";
import  { Link } from 'react-router-dom';
import  { FolderOpen, CalendarDays, ArrowRight } from 'lucide-react';
import  { useSchoolData } from '../context/SchoolDataContext';
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import usePageTitle from "../hooks/usePageTitle";

export default function Gallery() {
  usePageTitle("Gallery");
  const { albums, isLoading, error, refreshData } = useSchoolData();

  return (
    <div className="fade-in">
      {/* Gallery Page Header */}
      <section
        className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1645439811269-678eb9cb9266?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90">
            Life at Mission Academy
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Photo Gallery & Albums
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Glimpses of cultural events, scientific laboratories, sports
            tournaments, and classroom sessions.
          </p>
        </div>
      </section>

      {/* Album Cards Grid */}
      <section className="py-16 sm:py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Loading size="lg" height="h-64" />
          ) : error ? (
            <ErrorState
              title="Unable to load Photo Gallery"
              message={error}
              onRetry={refreshData}
            />
          ) : albums.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-gray-700 font-bold text-lg">
                No Albums Found
              </h3>
              <p className="text-gray-500 text-sm">
                Our administrative team has not posted any albums yet. Check
                back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  {/* Album Cover Photo */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden shrink-0">
                    <img
                      src={
                        album.coverImageUrl ||
                        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"
                      }
                      alt={album.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />

                    {/* Floating Count Badge */}
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm">
                      <FolderOpen className="h-3.5 w-3.5" />
                      <span>{album.images?.length || 0} Photos</span>
                    </div>
                  </div>

                  {/* Album Info Text */}
                  <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-400 text-xs font-semibold">
                        <CalendarDays className="h-3.5 w-3.5 text-school-primary" />
                        <span>
                          {new Date(album.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-gray-900 font-bold text-lg sm:text-xl leading-snug group-hover:text-school-primary transition-colors">
                        {album.name}
                      </h3>
                      {album.description && (
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <Link
                      id={`gallery-view-btn-${album.id}`}
                      to={`/gallery/${album.id}`}
                      className="w-full inline-flex items-center justify-center space-x-2 bg-school-bg hover:bg-school-primary text-school-primary hover:text-white py-3 rounded-xl font-bold text-sm transition-all duration-200"
                    >
                      <span>Explore Album</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
