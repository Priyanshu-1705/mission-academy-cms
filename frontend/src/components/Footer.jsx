import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Youtube,
  Instagram,
  Facebook,
  ArrowRight,
} from "lucide-react";
import SchoolLogo from "./SchoolLogo";
import { useSchoolData } from "../context/SchoolDataContext";

export default function Footer() {
  const location = useLocation();
  const { settings } = useSchoolData();

  // Do not show footer on admin dashboard
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const showCta = settings?.showCtaBanner !== false;

  // Calculate academic session dynamically:
  // - April (index 3) or later: [currentYear]-[nextYearShort] (e.g., June 2026 -> "2026-27")
  // - January (index 0) to March (index 2): [prevYear]-[currentYearShort] (e.g., February 2027 -> "2026-27")
  const getAcademicSession = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0 = January, 11 = December
    if (currentMonth >= 3) {
      const nextYearTwoDigits = String(currentYear + 1).slice(-2);
      return `${currentYear}-${nextYearTwoDigits}`;
    } else {
      const prevYear = currentYear - 1;
      const currentYearTwoDigits = String(currentYear).slice(-2);
      return `${prevYear}-${currentYearTwoDigits}`;
    }
  };

  const academicSession = getAcademicSession();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top CTA Banner */}
      {showCta && (
        <div className="border-b border-gray-800 bg-gray-900/50 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="text-white font-sans font-semibold text-lg sm:text-xl">
                Ready to shape your child's future?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Admissions are open for the academic session {academicSession}.
                Secure a seat today.
              </p>
            </div>
            <Link
              id="footer-cta-register"
              to="/register"
              className="inline-flex items-center space-x-2 bg-school-primary hover:bg-school-primary/95 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:translate-x-1"
            >
              <span>Apply Online Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <SchoolLogo className="h-10 w-10 object-contain" />
            </div>
            <span className="font-sans font-bold text-lg text-white leading-tight">
              MISSION ACADEMY
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Mission Academy Baheri is dedicated to imparting quality education,
            building strong character, and fostering creative minds to lead
            tomorrow's world with integrity.
          </p>
          <div className="flex items-center space-x-3.5 pt-2">
            <a
              id="footer-social-youtube"
              href={settings?.youtubeUrl || "https://youtube.com/@missionacademybaheri"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200"
              title="YouTube Channel"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              id="footer-social-instagram"
              href={settings?.instagramUrl || "https://instagram.com/missionacademybaheri"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-pink-600 hover:text-white rounded-xl transition-all duration-200"
              title="Instagram Page"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              id="footer-social-facebook"
              href={settings?.facebookUrl || "https://facebook.com/missionacademybaheri"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200"
              title="Facebook Page"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base font-sans relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-school-primary after:mt-2">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { name: "Home Page", path: "/" },
              { name: "About Academy", path: "/about" },
              { name: "Our Gallery", path: "/gallery" },
              { name: "Upcoming Events", path: "/events" },
              { name: "Board Achievements", path: "/achievements" },
              {
                name: "Mandatory CBSE Disclosures",
                path: "/mandatory-disclosure",
              },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="hover:text-school-primary flex items-center space-x-1.5 transition-colors duration-200"
                >
                  <ArrowRight className="h-3 w-3 text-school-primary" />
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CBSE Mandatory List */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base font-sans relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-school-primary after:mt-2">
            CBSE Guidelines
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <Link
                to="/mandatory-disclosure"
                className="hover:text-school-primary transition-colors"
              >
                • Fire Safety Certificate
              </Link>
            </li>
            <li>
              <Link
                to="/mandatory-disclosure"
                className="hover:text-school-primary transition-colors"
              >
                • Building Safety Certificate
              </Link>
            </li>
            <li>
              <Link
                to="/mandatory-disclosure"
                className="hover:text-school-primary transition-colors"
              >
                • Annual Academic Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/mandatory-disclosure"
                className="hover:text-school-primary transition-colors"
              >
                • Fee Structure & Timings
              </Link>
            </li>
            <li>
              <Link
                to="/mandatory-disclosure"
                className="hover:text-school-primary transition-colors"
              >
                • SMC & PTA Executive Committee
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-base font-sans relative after:content-[''] after:block after:w-8 after:h-0.5 after:bg-school-primary after:mt-2">
            Get in Touch
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-school-primary shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-relaxed">
                 Mission Academy School, Mandanpur, Baheri, Bareilly, Uttar Pradesh - 243201
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-school-primary shrink-0" />
              <span className="text-gray-400">
                {settings?.phone || "+91 94120 39482, +91 90581 23456"}
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-school-primary shrink-0" />
              <span className="text-gray-400 hover:text-school-primary transition-colors">
                {settings?.email || "info@missionacademybaheri.com"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-gray-950 py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>
            © {new Date().getFullYear()} Mission Academy, Baheri. All rights
            reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/contact"
              className="hover:text-school-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
