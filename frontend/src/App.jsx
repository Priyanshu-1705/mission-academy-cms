import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import AlbumView from "./pages/AlbumView";
import Events from "./pages/Events";
import Achievements from "./pages/Achievements";
import MandatoryDisclosure from "./pages/MandatoryDisclosure";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";
import { SchoolDataProvider } from "./context/SchoolDataContext";
import Layout from "./components/Layout";

export default function App() {
  return (
    <AuthProvider>
      <SchoolDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:id" element={<AlbumView />} />
              <Route path="/events" element={<Events />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
