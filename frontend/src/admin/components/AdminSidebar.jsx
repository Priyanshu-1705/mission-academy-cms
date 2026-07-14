import React from "react";
import {
  LayoutDashboard,
  Image,
  Calendar,
  Award,
  FileText,
  ClipboardList,
  MessageSquare,
  Settings,
  Users,
  User,
  LogOut,
  X,
} from "lucide-react";
import SchoolLogo from "../../components/SchoolLogo";

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  currentUser,
  role,
  pendingRegistrationsCount,
  pendingEnquiriesCount,
  handleLogout,
}) => {
  // Sidebar Links config
  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "banners", label: "Hero Banners", icon: Image },
    ...(role === "super_admin"
      ? [{ id: "leadership", label: "Leadership Messages", icon: User }]
      : []),
    { id: "gallery", label: "Gallery Albums", icon: Image },
    { id: "events", label: "School Events Calendar", icon: Calendar },
    { id: "achievements", label: "Toppers & Awards", icon: Award },
    ...(role === "super_admin"
      ? [{ id: "disclosure", label: "Mandatory Disclosures", icon: FileText }]
      : []),
    { id: "transfer-certificates", label: "Transfer Certificates", icon: FileText },
    {
      id: "registrations",
      label: "Online Registrations",
      icon: ClipboardList,
      badge: pendingRegistrationsCount,
    },
    {
      id: "enquiries",
      label: "Public Enquiries",
      icon: MessageSquare,
      badge: pendingEnquiriesCount,
    },
    { id: "settings", label: "CMS Settings", icon: Settings },
    ...(role === "super_admin"
      ? [{ id: "users", label: "Manage Administrators", icon: Users }]
      : []),
    { id: "profile", label: "My Profile", icon: User },
  ];

  return (
    <>
      {/* 1a. Mobile Sidebar Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 1. Left Sidebar Navigation Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 shrink-0 flex flex-col border-r border-gray-800 h-full transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Brand logo banner */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <SchoolLogo className="h-10 w-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm text-white tracking-tight leading-none">
                MISSION ACADEMY
              </span>
              <span className="font-sans text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>
          {/* Close button inside sidebar on mobile viewport */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl md:hidden transition-all cursor-pointer"
            title="Close Menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isSel = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`admin-side-link-${link.id}`}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${isSel
                  ? "bg-school-primary text-white"
                  : "hover:bg-gray-800 text-gray-400 hover:text-white"
                  }`}
              >
                <div className="flex items-center space-x-3 justify-start min-w-0">
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{link.label}</span>
                    {(link.id === "disclosure" || link.id === "users" || link.id === "leadership") && (
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mt-0.5">
                        Super Admin Only
                      </span>
                    )}
                  </div>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isSel ? "bg-white text-school-primary" : "bg-school-primary text-white"}`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar bottom profile */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs text-white font-extrabold border border-gray-700 shrink-0">
              {currentUser.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs leading-none">
                {currentUser}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5 font-medium">
                {role === "super_admin" ? "Super Admin" : "Principal"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            title="Log Out"
            className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
