import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, ClipboardCheck, AlertCircle } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import Loading from '../components/Loading';

export default function Register() {
  const { submitRegistration } = useSchoolData();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const [student, setStudent] = useState({
    studentName: "", dob: "", gender: "", classApplied: "", previousSchool: "",
  });

  const [parent, setParent] = useState({
    fatherName: "", motherName: "", parentPhone: "", parentEmail: "", address: "",
  });

  const classOptions = [
    "Nursery", "LKG", "UKG", "Class I", "Class II", "Class III", "Class IV",
    "Class V", "Class VI", "Class VII", "Class VIII", "Class IX",
    "Class XI Science", "Class XI Commerce",
  ];

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep1 = () => {
    const err = {};
    if (!student.studentName.trim()) err.studentName = "Student full name is required";
    if (!student.dob) err.dob = "Student date of birth is required";
    if (!student.gender) err.gender = "Gender is required";
    if (!student.classApplied) err.classApplied = "Please select the target class";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep2 = () => {
    const err = {};
    if (!parent.fatherName.trim()) err.fatherName = "Father's name is required";
    if (!parent.motherName.trim()) err.motherName = "Mother's name is required";
    if (!parent.parentPhone.trim()) {
      err.parentPhone = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(parent.parentPhone.trim())) {
      err.parentPhone = "Must be a valid 10-digit mobile number";
    }
    if (!parent.parentEmail.trim()) {
      err.parentEmail = "Parent email address is required";
    } else if (!/\S+@\S+\.\S+/.test(parent.parentEmail.trim())) {
      err.parentEmail = "Must be a valid email format";
    }
    if (!parent.address.trim()) err.address = "Complete residential address is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validateStep2()) return;

    setSubmitting(true);
    setApiError("");
    try {
      await submitRegistration({
        studentName: student.studentName.trim(),
        dob: student.dob,
        gender: student.gender,
        classApplied: student.classApplied,
        previousSchool: student.previousSchool.trim() || undefined,
        fatherName: parent.fatherName.trim(),
        motherName: parent.motherName.trim(),
        parentPhone: parent.parentPhone.trim(),
        email: parent.parentEmail.trim(),
        address: parent.address.trim(),
      });
      setSuccess(true);
    } catch (err) {
      console.error("Admission submission error:", err);
      setApiError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepsHeader = [
    { number: 1, label: "Student Profile" },
    { number: 2, label: "Parents & Residence" },
  ];

  return (
    <div className="fade-in bg-gray-50/50 min-h-screen pb-16">
      <section className="text-white py-16 sm:py-20 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1600&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-emerald-950/85 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-school-bg/90">Institutional Admissions Portal</span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight">Online Admission Application</h1>
          <p className="text-gray-105 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Register your child for the academic session 2026-27. Follow the two quick steps to submit details.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white px-6 sm:px-8 py-5 rounded-3xl border border-gray-150/60 shadow-xs mb-10">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-gray-150 z-0" />
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 h-0.5 bg-school-primary transition-all duration-300 z-0" style={{ width: step === 1 ? "0%" : "70%" }} />
              {stepsHeader.map((s, idx) => {
                const isCompleted = step > s.number;
                const isActive = step === s.number;
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10">
                    <div className={`h-10 sm:h-12 w-10 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${isCompleted ? "bg-school-primary text-white" : isActive ? "bg-white text-school-primary ring-4 ring-school-primary/10 border-2 border-school-primary" : "bg-gray-100 text-gray-400"}`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : s.number}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-semibold mt-2 ${isActive ? "text-school-primary font-bold" : isCompleted ? "text-gray-700" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-150/65 shadow-sm">
            {success ? (
              <div className="text-center p-8 space-y-6 animate-fadeIn">
                <div className="p-4 bg-emerald-50 text-school-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-sm">
                  <ClipboardCheck className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-sans font-bold text-2xl text-gray-900 leading-tight">Registration Submitted Successfully!</h2>
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                    We have received your online application for student <strong>{student.studentName}</strong> (Class {student.classApplied}). Our academic council will evaluate your application and contact you within 3 business days for entrance scheduling. Please bring original documents (birth certificate, report card, transfer certificate if applicable) at that time.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setStep(1);
                    setStudent({ studentName: "", dob: "", gender: "", classApplied: "", previousSchool: "" });
                    setParent({ fatherName: "", motherName: "", parentPhone: "", parentEmail: "", address: "" });
                  }}
                  className="bg-school-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-school-primary/95 transition-all cursor-pointer"
                >
                  Apply For Another Child
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-sans font-extrabold text-lg text-gray-950">Student Profile Information</h3>
                      <p className="text-gray-400 text-xs mt-0.5">Please provide exact spellings as documented on the birth certificate.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase block">Student Full Name <span className="text-red-500">*</span></label>
                      <input type="text" name="studentName" value={student.studentName} onChange={handleStudentChange} placeholder="e.g. Aarav Gangwar" className={`w-full bg-gray-50 border ${errors.studentName ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                      {errors.studentName && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.studentName}</span></p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Date of Birth <span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={student.dob} onChange={handleStudentChange} className={`w-full bg-gray-50 border ${errors.dob ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                        {errors.dob && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.dob}</span></p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Gender <span className="text-red-500">*</span></label>
                        <select name="gender" value={student.gender} onChange={handleStudentChange} className={`w-full bg-gray-50 border ${errors.gender ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`}>
                          <option value="">-- Select Gender --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.gender}</span></p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Class Applied For <span className="text-red-500">*</span></label>
                        <select name="classApplied" value={student.classApplied} onChange={handleStudentChange} className={`w-full bg-gray-50 border ${errors.classApplied ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`}>
                          <option value="">-- Select Applied Class --</option>
                          {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {errors.classApplied && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.classApplied}</span></p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Previous School Attended <span className="text-gray-400 font-light">(Optional)</span></label>
                        <input type="text" name="previousSchool" value={student.previousSchool} onChange={handleStudentChange} placeholder="e.g. Bareilly Primary, Baheri" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary focus:border-school-primary" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
                    {apiError && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 text-xs sm:text-sm animate-fadeIn">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{apiError}</span>
                      </div>
                    )}
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="font-sans font-extrabold text-lg text-gray-950">Parent & Residence Coordinates</h3>
                      <p className="text-gray-400 text-xs mt-0.5 font-light">Input primary communication details for alerts and evaluation scores.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Father's Name <span className="text-red-500">*</span></label>
                        <input type="text" name="fatherName" value={parent.fatherName} onChange={handleParentChange} placeholder="e.g. Shri Sanjay Gangwar" className={`w-full bg-gray-50 border ${errors.fatherName ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                        {errors.fatherName && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.fatherName}</span></p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Mother's Name <span className="text-red-500">*</span></label>
                        <input type="text" name="motherName" value={parent.motherName} onChange={handleParentChange} placeholder="e.g. Smt. Saritha Gangwar" className={`w-full bg-gray-50 border ${errors.motherName ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                        {errors.motherName && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.motherName}</span></p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Primary Contact Mobile <span className="text-red-500">*</span></label>
                        <input type="tel" name="parentPhone" maxLength={10} value={parent.parentPhone} onChange={handleParentChange} placeholder="e.g. 9412039482" className={`w-full bg-gray-50 border ${errors.parentPhone ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                        {errors.parentPhone && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.parentPhone}</span></p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase block">Active Email Address <span className="text-red-500">*</span></label>
                        <input type="email" name="parentEmail" value={parent.parentEmail} onChange={handleParentChange} placeholder="e.g. parents@domain.com" className={`w-full bg-gray-50 border ${errors.parentEmail ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2`} />
                        {errors.parentEmail && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.parentEmail}</span></p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 uppercase block">Complete Residential Address <span className="text-red-500">*</span></label>
                      <textarea name="address" rows={3} value={parent.address} onChange={handleParentChange} placeholder="Please input full permanent address including house details, landmark, village, and PIN Code..." className={`w-full bg-gray-50 border ${errors.address ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-school-primary"} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none`} />
                      {errors.address && <p className="text-red-500 text-xs flex items-center space-x-1 mt-1"><AlertCircle className="h-3.5 w-3.5" /><span>{errors.address}</span></p>}
                    </div>
                  </form>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-6">
                  {step > 1 ? (
                    <button onClick={prevStep} className="inline-flex items-center space-x-1.5 border border-gray-250 hover:bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer">
                      <ChevronLeft className="h-4.5 w-4.5" /><span>Previous Step</span>
                    </button>
                  ) : <div />}

                  {step < 2 ? (
                    <button onClick={nextStep} className="inline-flex items-center space-x-1.5 bg-school-primary hover:bg-school-primary/95 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer">
                      <span>Continue to Next</span><ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center space-x-1.5 bg-school-primary hover:bg-school-primary/95 disabled:bg-school-primary/50 text-white px-7 py-3 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-md">
                      {submitting ? <Loading size="sm" variant="white" height="" /> : <><ClipboardCheck className="h-5 w-5" /><span>Submit Registration</span></>}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}