import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export function Toast({ notification }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification && notification.message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!visible || !notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center space-x-3 p-4 rounded-2xl shadow-xl border animate-slideIn ${
      isSuccess
        ? "bg-emerald-50 border-emerald-200/60 text-emerald-800"
        : "bg-red-50 border-red-200/60 text-red-800"
    }`}>
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
      )}
      <p className="text-sm font-bold tracking-wide">{notification.message}</p>
      <button
        onClick={() => setVisible(false)}
        className={`p-1 rounded-lg transition-colors ${
          isSuccess
            ? "hover:bg-emerald-100 text-emerald-600"
            : "hover:bg-red-100 text-red-600"
        }`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
