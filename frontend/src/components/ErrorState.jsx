import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * A beautiful, reusable error state component that matches the school's design language.
 * Can be rendered as a full-page / section error block or a compact inline notice.
 * 
 * @param {Object} props
 * @param {string} [props.title] - Bold heading for the error
 * @param {string} [props.message] - Descriptive message of what failed
 * @param {function} [props.onRetry] - Optional retry callback function
 * @param {boolean} [props.compact] - Render in compact / inline mode
 * @param {string} [props.className] - Additional classes
 */
export default function ErrorState({
  title = "Unable to load information",
  message = "Please check your network connection and try again.",
  onRetry,
  compact = false,
  className = "",
}) {
  if (compact) {
    return (
      <div
        className={`flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800 ${className}`}
        role="alert"
      >
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="flex-grow">
          {title && <span className="font-semibold mr-1">{title}:</span>}
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-red-100 border border-red-200 text-red-700 hover:text-red-800 rounded-lg text-xs font-medium transition-all shadow-sm flex-shrink-0 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-md mx-auto my-6 fade-in ${className}`}
      role="alert"
    >
      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100/50">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-school-primary hover:bg-school-accent text-white rounded-xl text-sm font-medium transition-all shadow-sm cursor-pointer active:scale-95 hover:shadow"
        >
          <RefreshCw className="w-4 h-4 animate-hover-spin" />
          Try Again
        </button>
      )}
    </div>
  );
}
