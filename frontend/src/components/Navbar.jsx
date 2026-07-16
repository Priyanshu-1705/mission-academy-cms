import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Gallery", path: "/gallery" },
    { label: "Events", path: "/events" },
    { label: "Toppers", path: "/achievements" },
    { label: "Disclosures", path: "/mandatory-disclosure" },
    { label: "Admissions", path: "/register" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <SchoolLogo className="h-14 w-14 object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-school-primary tracking-tight leading-none">
                  MISSION ACADEMY
                </span>
                <span className="text-[10px] text-gray-500 tracking-widest font-medium mt-1">
                  BAHERI, BAREILLY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${isActive(link.path)
                    ? "bg-school-primary text-white"
                    : "text-gray-600 hover:text-school-primary hover:bg-gray-50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1.5 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive(link.path)
                  ? "bg-school-primary text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-school-primary"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
