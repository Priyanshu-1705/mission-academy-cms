import React from "react";
import { User, Shield } from "lucide-react";

export function ProfileTab({ currentUser, role }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-150/60 shadow-sm max-w-xl space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          My Administrator Account
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          View your administrator account information.
        </p>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center space-y-5 pt-4 border-t border-gray-100">
        <div className="w-24 h-24 rounded-full bg-school-primary/10 border-2 border-school-primary flex items-center justify-center">
          <User className="h-10 w-10 text-school-primary" />
        </div>

        <div className="text-center">
          <p className="font-extrabold text-xl text-gray-900">
            {currentUser}
          </p>

          <div className="mt-2 inline-flex items-center space-x-2 bg-school-primary/10 text-school-primary px-3 py-1 rounded-full">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {role === "super_admin"
                ? "Super Administrator"
                : "Principal"}
            </span>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="pt-5 border-t border-gray-100 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            User
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {currentUser}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Role
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {role === "super_admin"
              ? "Super Administrator"
              : "Principal"}
          </p>
        </div>
      </div>
    </div>
  );
}