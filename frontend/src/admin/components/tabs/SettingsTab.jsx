import React from "react";
import { Save, Lock } from "lucide-react";

const SCHOOL_INFO = {
  schoolName: "Mission Academy",
  address: "Bareilly, Uttar Pradesh",
  affiliationNo: "213XXXX",
  schoolCode: "709XX",
};

export function SettingsTab({
  settingsForm,
  setSettingsForm,
  handleSaveSettings,
}) {
  const handleChange = (field, value) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-150/60 shadow-sm space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          General School Profile
        </h2>
        <p className="text-gray-500 text-xs mt-1">
          Configure the contact information and website settings displayed on
          the public website.
        </p>
      </div>

      {/* Read Only School Information */}
      <div className="bg-gray-50/40 p-5 rounded-2xl border border-gray-150/50 space-y-5">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-150/50">
          <Lock className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Official Institution Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* School Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              School Name
            </label>

            <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {SCHOOL_INFO.schoolName}
            </div>

            <span className="text-[10px] text-gray-400 font-medium block">
              Permanent school information
            </span>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Address
            </label>

            <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {SCHOOL_INFO.address}
            </div>

            <span className="text-[10px] text-gray-400 font-medium block">
              Permanent school information
            </span>
          </div>

          {/* Affiliation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              CBSE Affiliation Number
            </label>

            <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {SCHOOL_INFO.affiliationNo}
            </div>

            <span className="text-[10px] text-gray-400 font-medium block">
              Permanent school information
            </span>
          </div>

          {/* School Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              School Code
            </label>

            <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 font-medium">
              {SCHOOL_INFO.schoolCode}
            </div>

            <span className="text-[10px] text-gray-400 font-medium block">
              Permanent school information
            </span>
          </div>
        </div>
      </div>

      {/* Contact & Social Media */}
      <div className="space-y-5">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Contact & Social Channels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Official Phone
            </label>

            <input
              type="text"
              value={settingsForm.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91-9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Official Email
            </label>

            <input
              type="email"
              value={settingsForm.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="school@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>
          
          {/* Instagram */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Instagram URL
            </label>

            <input
              type="url"
              value={settingsForm.instagramUrl || ""}
              onChange={(e) => handleChange("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/missionacademy"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          {/* Facebook */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Facebook URL
            </label>

            <input
              type="url"
              value={settingsForm.facebookUrl || ""}
              onChange={(e) => handleChange("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/missionacademy"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>

          {/* YouTube */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              YouTube URL
            </label>

            <input
              type="url"
              value={settingsForm.youtubeUrl || ""}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
              placeholder="https://youtube.com/@missionacademy"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-school-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Website Options */}
      <div className="space-y-4 bg-gray-50/40 p-5 rounded-2xl border border-gray-150/50">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          Website Content
        </h3>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!settingsForm.showCtaBanner}
            onChange={(e) =>
              handleChange("showCtaBanner", e.target.checked)
            }
            className="w-4 h-4 text-school-primary border-gray-300 rounded focus:ring-school-primary/20"
          />

          <span className="text-sm font-semibold text-gray-700">
            Display Admission CTA Banner
          </span>
        </label>

        <p className="text-[10px] text-gray-400 font-medium">
          Enable or disable the admission call-to-action banner shown on
          the public website.
        </p>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center space-x-2 bg-school-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}