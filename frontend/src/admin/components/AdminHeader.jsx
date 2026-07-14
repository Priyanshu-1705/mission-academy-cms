import React from "react";
import { Menu, ExternalLink } from "lucide-react";

export const AdminHeader = ({ activeTab, role, setIsMobileSidebarOpen }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-150 flex items-center justify-between px-6 md:px-8 shrink-0">
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Hamburger Menu Toggle on Mobile Viewports */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-xl transition-all md:hidden cursor-pointer"
          title="Open Navigation Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl text-gray-900 leading-none tracking-tight flex items-center gap-2 flex-wrap">
          <span>
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "banners" && "Hero Banners"}
            {activeTab === "leadership" && "Leadership Messages"}
            {activeTab === "gallery" && "Gallery Albums"}
            {activeTab === "events" && "School Events Calendar"}
            {activeTab === "achievements" && "Academic Toppers & Awards"}
            {activeTab === "disclosure" && "CBSE Mandatory Disclosures"}
            {activeTab === "registrations" && "Online Registrations"}
            {activeTab === "enquiries" && "Admissions & Public Enquiries"}
            {activeTab === "settings" && "General CMS Settings"}
            {activeTab === "users" && "Manage Administrative Users"}
            {activeTab === "profile" && "My Account Profile"}
          </span>
          {(activeTab === "disclosure" || activeTab === "users" || activeTab === "leadership") && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider border border-amber-200">
              Super Admin Only
            </span>
          )}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-school-primary bg-school-bg px-3.5 py-2 rounded-xl border border-school-primary/10 hover:shadow-xs"
        >
          <span>View School Site</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
};

export default AdminHeader;
