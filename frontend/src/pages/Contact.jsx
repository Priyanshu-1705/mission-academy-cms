import React, { useState } from 'react';
import  { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import  { useSchoolData } from '../context/SchoolDataContext';
import Loading from '../components/Loading';
import usePageTitle from "../hooks/usePageTitle";

export default function Contact() {
  usePageTitle("Contact Us");
  const { submitEnquiry, settings } = useSchoolData();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Full Name is required";
    if (!form.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      tempErrors.phone = "Must be a valid 10-digit mobile number";
    }

    if (!form.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Must be a valid email format";
    }

    if (!form.message.trim()) {
      tempErrors.message = "Message cannot be empty";
    } else if (form.message.trim().length < 15) {
      tempErrors.message = "Please write a message of at least 15 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error dynamically
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setSubmitSuccess(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setApiError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in bg-gray-50/50 min-h-screen pb-16">
      {/* Page Header */}
      <section
        className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1740560051533-3acef26ace95?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90">
            Reach Out To Our Administration
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Contact Mission Academy
          </h1>
          <p className="text-gray-105 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Have questions about fee payments, sports club schedules, or
            admission trials? We are here to assist you.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Form */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Office Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-school-primary block">
                Office Coordinates
              </span>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">
                Visit or Call Us
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our campus receptionist desk is available for offline
                registrations, manual document submissions, or principal
                meetings during working periods.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start space-x-4 shadow-xs">
                <div className="p-3 bg-school-primary/10 text-school-primary rounded-xl shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-gray-900 font-bold text-sm sm:text-base">
                    Campus Address
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Mission Academy School, Mandanpur, Baheri, Bareilly, Uttar Pradesh - 243201
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start space-x-4 shadow-xs">
                <div className="p-3 bg-school-primary/10 text-school-primary rounded-xl shrink-0 mt-0.5">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-gray-900 font-bold text-sm sm:text-base">
                    Admission Helplines
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm font-semibold text-school-primary">
                    {settings?.phone || "+91-9412156822"}
                  </p>
                  <p className="text-gray-400 text-[10px]">
                    Calling Hours: 08:00 AM to 03:00 PM
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start space-x-4 shadow-xs">
                <div className="p-3 bg-school-primary/10 text-school-primary rounded-xl shrink-0 mt-0.5">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-gray-900 font-bold text-sm sm:text-base">
                    Electronic Mail
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm hover:text-school-primary transition-colors">
                    {settings?.email || "info@missionacademybaheri.com"}
                  </p>
                </div>
              </div>

              {/* Timings */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-start space-x-4 shadow-xs">
                <div className="p-3 bg-school-primary/10 text-school-primary rounded-xl shrink-0 mt-0.5">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-gray-900 font-bold text-sm sm:text-base">
                    School Timings
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    <strong>Summer:</strong> 07:30 AM - 01:30 PM <br />
                    <strong>Winter:</strong> 08:30 AM - 02:30 PM <br />
                    <em>Sundays are weekly holidays.</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact/Enquiry Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150/65 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-xl sm:text-2xl text-gray-900">
                  Submit an Admission Enquiry
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  Fill in your academic question details, and our institutional
                  admissions counselor will respond within 24 hours.
                </p>
              </div>

              {submitSuccess ? (
                // SUCCESS feedback
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
                  <CheckCircle className="h-12 w-12 text-school-primary mx-auto" />
                  <div className="space-y-2">
                    <h4 className="font-bold text-lg text-gray-900">
                      Enquiry Submitted Successfully!
                    </h4>
                    <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Mission Academy Baheri. We have
                      recorded your submission. Our office staff will call you
                      on the registered mobile number shortly.
                    </p>
                  </div>
                  <button
                    id="contact-submit-another"
                    onClick={() => setSubmitSuccess(false)}
                    className="bg-school-primary text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl hover:bg-school-primary/95 transition-all"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {apiError && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 text-xs sm:text-sm animate-fadeIn">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider block"
                    >
                      Parent or Student Full Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Shri Sanjay Gangwar"
                      className={`w-full bg-gray-50 border ${
                        errors.name
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-gray-200 focus:ring-school-primary focus:border-school-primary"
                      } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all`}
                    />

                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-xs font-bold text-gray-700 uppercase tracking-wider block"
                      >
                        10-Digit Mobile Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        maxLength={10}
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9412039482"
                        className={`w-full bg-gray-50 border ${
                          errors.phone
                            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                            : "border-gray-200 focus:ring-school-primary focus:border-school-primary"
                        } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />

                      {errors.phone && (
                        <p className="text-red-500 text-xs flex items-center space-x-1 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold text-gray-700 uppercase tracking-wider block"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. example@domain.com"
                        className={`w-full bg-gray-50 border ${
                          errors.email
                            ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                            : "border-gray-200 focus:ring-school-primary focus:border-school-primary"
                        } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all`}
                      />

                      {errors.email && (
                        <p className="text-red-500 text-xs flex items-center space-x-1 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs font-bold text-gray-700 uppercase tracking-wider block"
                    >
                      Enquiry Message Details{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Please write down detail questions regarding admission class, required boarding details, or document certificates..."
                      className={`w-full bg-gray-50 border ${
                        errors.message
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-gray-200 focus:ring-school-primary focus:border-school-primary"
                      } rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all resize-none`}
                    />

                    {errors.message && (
                      <p className="text-red-500 text-xs flex items-center space-x-1 mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-school-primary hover:bg-school-primary/95 disabled:bg-school-primary/50 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-xl cursor-pointer shadow-md transition-all active:translate-y-0.5"
                  >
                    {submitting ? (
                      <Loading size="sm" variant="white" height="" />
                    ) : (
                      <>
                        <Send className="h-4.5 w-4.5" />
                        <span>Send Enquiry Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
