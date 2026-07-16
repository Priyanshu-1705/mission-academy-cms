import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ isOpen, onClose, photos, currentIndex, setCurrentIndex }) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && photos && photos.length > 1) {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      } else if (e.key === "ArrowLeft" && photos && photos.length > 1) {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, photos, onClose, setCurrentIndex]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev button */}
      {photos.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-6 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {/* Main Image container */}
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <img
          src={currentPhoto.imageUrl || currentPhoto}
          alt={currentPhoto.caption || "Gallery Photo"}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        />
        {currentPhoto.caption && (
          <p className="text-white/90 text-sm font-medium tracking-wide">
            {currentPhoto.caption}
          </p>
        )}
      </div>

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-6 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}
    </div>
  );
}
