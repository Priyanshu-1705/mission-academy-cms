import React from "react";
import { Users, Mail, Calendar } from "lucide-react";

export function DashboardTab({ stats, enquiries, registrations, setActiveTab }) {
  const cards = [
    {
      label: "Total Registrations",
      value: stats?.pendingRegistrationsCount ?? 0,
      icon: Users,
      color: "text-indigo-600 bg-indigo-50",
      tab: "registrations"
    },
    {
      label: "Total Events",
      value: stats?.eventsCount ?? 0,
      icon: Calendar,
      color: "text-rose-600 bg-rose-50",
      tab: "events"
    },
    {
      label: "Gallery Albums",
      value: stats?.albumsCount ?? 0,
      icon: Mail,
      color: "text-amber-600 bg-amber-50",
      tab: "gallery"
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Administrator</h1>
        <p className="text-gray-500 text-sm mt-1">Here's a quick overview of what's happening at Mission Academy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => setActiveTab(card.tab)}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-school-primary shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-extrabold text-gray-950">{card.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Registrations</h2>
            <button onClick={() => setActiveTab("registrations")} className="text-xs font-bold text-school-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100 overflow-x-auto">
            {registrations?.slice(0, 5).map((reg) => (
              <div key={reg.id} className="py-3 flex justify-between items-center min-w-[300px]">
                <div>
                  <p className="font-bold text-sm text-gray-900">{reg.studentName}</p>
                  <p className="text-xs text-gray-500">Applied for {reg.classApplied} | {reg.parentPhone}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  reg.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                  reg.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Enquiries</h2>
            <button onClick={() => setActiveTab("enquiries")} className="text-xs font-bold text-school-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100 overflow-x-auto">
            {enquiries?.slice(0, 5).map((enq) => (
              <div key={enq.id} className="py-3 flex justify-between items-center min-w-[300px]">
                <div>
                  <p className="font-bold text-sm text-gray-900">{enq.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{enq.message}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  enq.status === "resolved" ? "bg-gray-100 text-gray-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}