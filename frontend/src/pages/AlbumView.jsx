import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, FolderOpen, Maximize2 } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import Lightbox from "../components/Lightbox";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import usePageTitle from "../hooks/usePageTitle";

export default function AlbumView() {
  usePageTitle("Album View");
  const { id } = useParams();
  const { albums, isLoading, error, refreshData } = useSchoolData();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const album = albums.find((a) => String(a.id) === String(id)) || null;

  if (isLoading) {
    return (
      <Loading size="lg" height="h-screen" containerClassName="bg-gray-50" />
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center items-center">
        <ErrorState
          title="Unable to load Album"
          message={error}
          onRetry={refreshData}
        />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <FolderOpen className="h-16 w-16 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900">Album Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          The gallery album you are looking for does not exist or has been
          removed by the administrator.
        </p>
        <Link
          to="/gallery"
          className="inline-flex items-center space-x-2 bg-school-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-school-primary/95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Gallery</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in bg-gray-50/50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-white border-b border-gray-100 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            id="album-back-gallery"
            to="/gallery"
            className="inline-flex items-center space-x-1.5 text-school-primary font-bold text-sm hover:text-school-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Albums</span>
          </Link>
          <div className="space-y-2">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 tracking-tight">
              {album.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <CalendarDays className="h-4 w-4 text-school-primary" />
                <span>
                  {new Date(album.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 font-semibold text-school-primary bg-school-bg px-2.5 py-0.5 rounded-full">
                <span>{album.images?.length || 0} Photos</span>
              </span>
            </div>
            {album.description && (
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl pt-2">
                {album.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(album.images?.length ?? 0) === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-gray-700 font-bold text-lg">
                No Photos Inside
              </h3>
              <p className="text-gray-500 text-sm">
                No images have been uploaded into this album yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {album.images.map((img, index) => (
                <div
                  key={img.id}
                  id={`album-photo-card-${index}`}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-4/3 sm:aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200/50 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300"
                >
                  <img
                    src={img.url}
                    alt={img.caption || "Album photo"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay with Caption & Zoom Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex justify-between items-end text-white space-x-3">
                      <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2">
                        {img.caption || "Click to expand"}
                      </p>
                      <div className="p-1.5 bg-white/20 backdrop-blur-xs rounded-lg shrink-0">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Fullscreen Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          isOpen={lightboxIndex !== null}
          photos={album.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          setCurrentIndex={setLightboxIndex}
        />
      )}
    </div>
  );
}
