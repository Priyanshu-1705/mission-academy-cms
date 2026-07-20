import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  FileText,
  Download,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
  Library,
  FileBadge,
} from "lucide-react";
import { useSchoolData } from "../context/SchoolDataContext";
import { transferCertificateService } from "../services/transferCertificateService";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import usePageTitle from "../hooks/usePageTitle";

export default function MandatoryDisclosure() {
  usePageTitle("Mandatory Disclosures");
  const { disclosures: documents, isLoading, error, refreshData } = useSchoolData();
  const location = useLocation();
  const tcSectionRef = useRef(null);

  // States for certificate lookup
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [tcError, setTcError] = useState("");
  const [tcSuccess, setTcSuccess] = useState("");
  const [tcSubmitting, setTcSubmitting] = useState(false);

  // Parse tab search query to scroll to TC section
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("tab") === "tc" && tcSectionRef.current) {
      setTimeout(() => {
        tcSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [location]);

  const handleTcLookup = async (e) => {
    e.preventDefault();
    if (tcSubmitting) return;
    setTcError("");
    setTcSuccess("");

    if (!admissionNumber.trim()) {
      setTcError("Please enter your Admission Number.");
      return;
    }

    const cleanedNo = admissionNumber.trim();
    setTcSubmitting(true);

    try {
      const result = await transferCertificateService.lookupCertificateByAdmissionNumber(cleanedNo);

      if (result?.pdfUrl) {
        const link = document.createElement("a");
        link.href = result.pdfUrl;
        link.setAttribute("download", `transfer_certificate_${cleanedNo}.pdf`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setAdmissionNumber("");
        setTcSuccess("Transfer certificate downloaded successfully!");
      } else {
        setTcError("Transfer certificate not found.");
      }
    } catch (err) {
      console.error("Error retrieving certificate:", err);
      setTcError(err.message || "Error retrieving certificate. Please try again later.");
    } finally {
      setTcSubmitting(false);
    }
  };

  // Group documents by category
  const groupedDocs = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const categories = Object.keys(groupedDocs);

  const CATEGORY_LABELS = {
    general_information: "General Information",
    documents_information: "Documents & Information",
    results_academics: "Results & Academics",
    staff_infrastructure: "Staff & Infrastructure"
  };

  return (
    <div className="fade-in bg-gray-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <section
        className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90 flex items-center justify-center space-x-1.5">
            <ShieldAlert className="h-4 w-4 text-emerald-300" />
            <span>CBSE Regulatory Compliance</span>
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Mandatory Disclosures
          </h1>
          <p className="text-gray-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            In accordance with CBSE guidelines, here are the official school
            certificates, trust registrations, safety declarations, and fee
            structure charts.
          </p>
        </div>
      </section>

      {/* Main Document Listing Stage */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Regulatory Advisory Note */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 sm:p-6 flex items-start space-x-4">
            <CheckCircle className="h-6 w-6 text-school-primary shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-none">
                Verified Compliance Information
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Mission Academy, Baheri holds active affiliation with the
                Central Board of Secondary Education. All safety audits,
                building tests, and fire drills are executed at strict legal
                intervals by competent government agencies.
              </p>
            </div>
          </div>

          {isLoading ? (
            <Loading size="lg" height="h-48" />
          ) : error ? (
            <ErrorState
              title="Unable to load Disclosures"
              message={error}
              onRetry={refreshData}
            />
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
              <FileText className="h-12 w-12 text-gray-300 mx-auto" />
              <h3 className="text-gray-700 font-bold text-lg">
                No Disclosures Uploaded
              </h3>
              <p className="text-gray-500 text-sm">
                Regulatory documents are currently being cataloged by
                administration.
              </p>
            </div>
          ) : (
            categories.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                {/* Category Header Label */}
                <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
                  <Library className="h-5 w-5 text-school-primary shrink-0" />
                  <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 tracking-tight uppercase">
                    {CATEGORY_LABELS[cat] || cat}
                  </h3>
                </div>

                {/* Grouped Table/List */}
                <div className="bg-white rounded-2xl border border-gray-150/60 overflow-hidden shadow-sm divide-y divide-gray-100">
                  {groupedDocs[cat].map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 hover:bg-gray-50/50 transition-colors gap-4"
                    >
                      {/* Left: Code, Title, Icon */}
                      <div className="flex items-start space-x-4">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0 mt-0.5">
                          <FileText className="h-5.5 w-5.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {doc.documentCode && (
                              <span className="bg-gray-100 text-gray-600 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-gray-200">
                                {doc.documentCode}
                              </span>
                            )}
                            <span className="text-[10px] text-school-primary font-bold tracking-wider uppercase">
                              PDF Document
                            </span>
                          </div>
                          <h4 className="text-gray-800 font-semibold text-sm sm:text-base leading-snug">
                            {doc.title}
                          </h4>
                        </div>
                      </div>

                      {/* Right: Download/View Button */}
                      <a
                        id={`disclosure-download-btn-${doc.id}`}
                        href={doc.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-school-bg hover:bg-school-primary text-school-primary hover:text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 border border-school-primary/10 hover:shadow-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>View / Download</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* New SECTION: Complete tour of school */}
          <section className="mt-20">
            <div className="max-w-5xl mx-auto">
              <span className="text-sm font-bold uppercase tracking-widest text-school-primary">
                Additional Resource
              </span>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Virtual Campus Tour
              </h2>

              <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                Explore Mission Academy through our official campus tour and get a glimpse
                of our classrooms, laboratories, sports facilities, library, and vibrant
                learning environment.
              </p>

              <div className="mt-8 overflow-hidden rounded-3xl shadow-xl">
                <iframe
                  className="w-full aspect-video"
                  src="https://www.youtube.com/embed/a3_Lhzbi94U"
                  title="Mission Academy Campus Tour"
                  allowFullScreen
                />
              </div>
            </div>
          </section>

          {/* NEW SECTION: Student Documents & Services */}
          <div ref={tcSectionRef} className="space-y-6 pt-6">
            <div className="flex items-center space-x-3 border-b border-gray-200 pb-3">
              <FileBadge className="h-5 w-5 text-school-primary shrink-0" />
              <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 tracking-tight uppercase">
                Student Documents & Services
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Document Type 1: Transfer Certificate */}
              <div className="bg-white rounded-2xl border border-gray-150/60 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Active Portal
                    </span>
                    <span className="text-xs text-gray-400">Security Verified</span>
                  </div>
                  <h4 className="text-gray-900 font-bold text-base sm:text-lg">
                    Transfer Certificate (T.C.)
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Official transfer clearance document generated for students leaving the academy or graduating to higher institutions. Enter your registered admission code below to retrieve yours.
                  </p>
                </div>

                <form onSubmit={handleTcLookup} className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Admission No. (e.g. MA2026001)"
                      value={admissionNumber}
                      onChange={(e) => {
                        setAdmissionNumber(e.target.value);
                        if (tcError) setTcError("");
                        if (tcSuccess) setTcSuccess("");
                      }}
                      className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-school-primary/20 w-full sm:w-56"
                    />
                    {tcError && (
                      <p className="text-red-500 text-[10px] font-semibold mt-1">
                        {tcError}
                      </p>
                    )}
                    {tcSuccess && (
                      <p className="text-emerald-600 text-[10px] font-semibold mt-1">
                        {tcSuccess}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={tcSubmitting}
                    className="inline-flex items-center justify-center space-x-2 bg-school-primary hover:bg-school-primary/90 disabled:bg-school-primary/50 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all min-w-[130px]"
                  >
                    {tcSubmitting ? (
                      <Loading size="sm" variant="white" height="" />
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>View / Retrieve</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
