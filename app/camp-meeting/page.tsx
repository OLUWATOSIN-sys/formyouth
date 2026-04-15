"use client";

import { useState, useEffect } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

interface Settings {
  signInEnabled: boolean;
  signInDeadline: string | null;
  signOutEnabled: boolean;
}

export default function CampMeetingPage() {
  const [formData, setFormData] = useState({
    date: "",
    fullName: "",
    gender: "",
    parish: "",
  });
  const [activeTab, setActiveTab] = useState<"signin" | "signout">("signin");
  const [signOutData, setSignOutData] = useState({ date: "", fullName: "" });
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [signOutSuccess, setSignOutSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    document.title = "Cave of Adullam 2026 - Camp Meeting Sign-In";
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/camp-meeting/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/camp-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
        setFormData({
          date: "",
          fullName: "",
          gender: "",
          parish: "",
        });
      } else if (data.error === "already_signed_in") {
        setError(data.message || "You are already signed in for this date!");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignOutLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/camp-meeting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "selfSignOut",
          fullName: signOutData.fullName,
          date: signOutData.date
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignOutSuccess(true);
        setSignOutData({ date: "", fullName: "" });
        setTimeout(() => setSignOutSuccess(false), 3000);
      } else {
        setError(data.message || "Could not find your sign-in record.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setSignOutLoading(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url('/camp-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-orange-900/40 to-yellow-900/50" />
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl tracking-wide ${anton.className}`}>
            Welcome to Camp!
          </h1>
          
          <p className={`text-2xl md:text-3xl text-amber-200 mb-4 font-semibold tracking-wide ${anton.className}`}>
            CAVE OF ADULLAM 2026
          </p>

          <p className="text-xl text-white/80 mb-8">
            You have been signed in successfully!
          </p>
          
          <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <p className="text-amber-300 font-bold text-lg">
              Theme: &quot;As He Prayed&quot; - Luke 9:29
            </p>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => setSubmitted(false)}
              className="px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50"
            >
              Sign In Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/camp-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-orange-900/60 to-red-900/70" />
      
      {/* Animated Light Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-yellow-400/20 via-orange-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-red-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-10 animate-slide-down">
          {/* Logo */}
          <div className="-mb-4 md:-mb-24">
            <img
              src="/camp-logo.png"
              alt="YAYA SA 2 Youth Camp 2026"
              className="w-full max-w-[90vw] md:max-w-5xl lg:max-w-6xl mx-auto h-auto object-contain drop-shadow-2xl scale-110 md:scale-125 translate-x-6 md:translate-x-12"
            />
          </div>
          
          {/* Theme Banner */}
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 backdrop-blur-xl rounded-2xl border border-amber-400/30 shadow-2xl mb-3">
            <p className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 tracking-wide ${anton.className}`}>
              CAVE OF ADULLAM
            </p>
            <p className="text-xl md:text-2xl text-white/90 font-semibold mt-2">
              Theme: &quot;As He Prayed&quot; - Luke 9:29
            </p>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl tracking-wide ${anton.className}`}>
            Camp Ground Sign-In
          </h1>
          
          <p className="text-xl md:text-2xl text-amber-200/90">
            Register your attendance at the Youth Camp
          </p>
        </div>

        {/* Sign-In Form Card */}
        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="backdrop-blur-2xl bg-white/10 border-2 border-amber-400/30 rounded-3xl p-5 sm:p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {/* Tabs */}
            <div className="flex mb-8 bg-white/10 rounded-2xl p-1 border border-amber-400/20">
              <button
                type="button"
                onClick={() => { setActiveTab("signin"); setError(null); }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "signin"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                    : "text-white/60 hover:text-white"
                } ${anton.className}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("signout"); setError(null); }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "signout"
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                    : "text-white/60 hover:text-white"
                } ${anton.className}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

            {activeTab === "signin" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl text-center animate-pulse">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-300 font-bold text-lg">{error}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setError(null)}
                    className="mt-3 text-red-400 underline text-sm hover:text-red-300"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Date Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-base sm:text-lg placeholder-white/40 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 [color-scheme:dark] hover:border-amber-400/50 group-hover:bg-white/15"
                />
              </div>

              {/* Full Name Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-base sm:text-lg placeholder-white/40 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 hover:border-amber-400/50 group-hover:bg-white/15"
                />
              </div>

              {/* Gender Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "Male" })}
                    className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                      formData.gender === "Male"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                        : "bg-white/10 text-white/70 border-2 border-white/20 hover:border-blue-400/50 hover:bg-white/15"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "Female" })}
                    className={`py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                      formData.gender === "Female"
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
                        : "bg-white/10 text-white/70 border-2 border-white/20 hover:border-pink-400/50 hover:bg-white/15"
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Female
                  </button>
                </div>
              </div>

              {/* Parish Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Parish
                </label>
                <input
                  type="text"
                  required
                  value={formData.parish}
                  onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
                  placeholder="Enter your parish name"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-base sm:text-lg placeholder-white/40 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 hover:border-amber-400/50 group-hover:bg-white/15"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.gender}
                className={`w-full py-4 sm:py-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 ${anton.className}`}
              >
                {loading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>SIGN IN TO CAMP</span>
                  </>
                )}
              </button>
            </form>
            ) : (
            <>
              {/* Sign-out disabled message */}
              {settings && !settings.signOutEnabled && (
                <div className="p-6 bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl text-center mb-6">
                  <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className={`text-2xl font-bold text-amber-400 mb-2 ${anton.className}`}>Sign-Out Not Available Right Now</h3>
                  
                </div>
              )}

              {settings?.signOutEnabled && (
              <form onSubmit={handleSignOut} className="space-y-6">
                {/* Success Message */}
                {signOutSuccess && (
                <div className="p-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-300 font-bold text-lg">Signed out successfully!</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-300 font-bold text-lg">{error}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setError(null)}
                    className="mt-3 text-red-400 underline text-sm hover:text-red-300"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Date Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={signOutData.date}
                  onChange={(e) => setSignOutData({ ...signOutData, date: e.target.value })}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-base sm:text-lg placeholder-white/40 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 [color-scheme:dark] hover:border-amber-400/50 group-hover:bg-white/15"
                />
              </div>

              {/* Full Name Field */}
              <div className="group">
                <label className="block text-amber-300 font-bold mb-3 text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name (as signed in)
                </label>
                <input
                  type="text"
                  required
                  value={signOutData.fullName}
                  onChange={(e) => setSignOutData({ ...signOutData, fullName: e.target.value })}
                  placeholder="Enter your full name exactly as you signed in"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-base sm:text-lg placeholder-white/40 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 focus:outline-none transition-all duration-300 hover:border-amber-400/50 group-hover:bg-white/15"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signOutLoading}
                className={`w-full py-4 sm:py-6 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 ${anton.className}`}
              >
                {signOutLoading ? (
                  <>
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing Out...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>SIGN OUT FROM CAMP</span>
                  </>
                )}
              </button>
              </form>
              )}
            </>
            )}

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                YAYA SA 2 Youth Camp 2026 | Cave of Adullam
              </p>
            </div>
          </div>
        </div>

        {/* Animated Bottom Decoration */}
        <div className="mt-12 flex justify-center gap-4 animate-bounce">
          <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
          <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50 animation-delay-100" />
          <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animation-delay-200" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>

      {/* Thank You Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-md backdrop-blur-2xl bg-gradient-to-br from-amber-900/95 via-orange-900/95 to-red-900/95 border-2 border-amber-400/30 rounded-[2rem] p-10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] text-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className={`text-4xl font-bold text-white mb-4 ${anton.className}`}>
              Thank You!
            </h2>
            
            <p className={`text-2xl text-amber-300 mb-2 font-semibold ${anton.className}`}>
              Welcome to Camp!
            </p>
            
            <p className={`text-2xl text-amber-400 font-bold mb-6 ${anton.className}`}>
              CAVE OF ADULLAM 2026
            </p>

            <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <p className="text-amber-300 font-semibold">
                Theme: &quot;As He Prayed&quot; - Luke 9:29
              </p>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-orange-500/50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
