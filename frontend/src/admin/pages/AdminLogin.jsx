import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import SchoolLogo from "../../components/SchoolLogo";
import Loading from "../../components/Loading";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password.trim());
      if (res.success) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Return home absolute link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-sm text-gray-500 hover:text-school-primary font-bold transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to School Site</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Brand Header */}
        <div className="inline-flex justify-center">
          <SchoolLogo className="h-24 w-24 object-contain" />
        </div>
        <div className="space-y-1">
          <h2 className="text-gray-900 text-3xl font-extrabold tracking-tight">
            Admin CMS Portal
          </h2>
          <p className="text-gray-500 text-sm">
            Mission Academy Baheri, Bareilly
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-150/60 shadow-md space-y-6">


          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold text-gray-700 uppercase block tracking-wider"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary focus:border-school-primary"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-gray-700 uppercase block tracking-wider"
              >
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary focus:border-school-primary"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              id="admin-login-submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-school-primary hover:bg-school-primary/95 disabled:bg-school-primary/50 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-xl cursor-pointer shadow-sm transition-all"
            >
              {loading ? (
                <Loading size="sm" variant="white" height="" />
              ) : (
                <span>Access CMS Console</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
