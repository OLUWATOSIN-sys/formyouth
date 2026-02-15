"use client";

import { useState } from "react";

export default function SuggestionPage() {
  const [formData, setFormData] = useState({
    suggestion: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Birthday form state
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
  });
  const [birthdaySubmitted, setBirthdaySubmitted] = useState(false);
  const [birthdayLoading, setBirthdayLoading] = useState(false);

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBirthdayLoading(true);

    try {
      const response = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthdayData),
      });

      if (response.ok) {
        setBirthdaySubmitted(true);
        setBirthdayData({ fullName: "", dateOfBirth: "", phoneNumber: "", email: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setBirthdayLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          anonymous: true,
          name: "Anonymous",
          email: "",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ suggestion: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8 animate-bounce-slow">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Thank You!
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Your voice matters to us
          </p>
          
         
          
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/50"
          >
            Submit Another Suggestion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-down">
          <div className="inline-block mb-6">
            <img
              src="https://www.rccgheavensgate.org/wp-content/uploads/2022/01/cropped-Logo-2.png"
              alt="RCCG Heavens Gate Logo"
              className="w-36 h-36 mx-auto object-contain"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            Suggestion Box
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 mb-2">
            RCCG Heavens Gate Youth
          </p>
          
          <p className="text-lg text-purple-300/80 max-w-2xl mx-auto">
            Share your thoughts with us.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Suggestion */}
              <div>
                <label className="block text-purple-300 font-medium mb-3">Your Suggestion</label>
                <textarea
                  required
                  value={formData.suggestion}
                  onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                  rows={6}
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-all resize-none"
                  placeholder="Share your suggestion..."
                />
                <p className="text-white/40 text-sm mt-2">
                  {formData.suggestion.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Birthday Registration Card */}
          <div className="mt-8">
            <button
              onClick={() => setShowBirthdayForm(!showBirthdayForm)}
              className="w-full backdrop-blur-xl bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-yellow-500/20 border border-white/20 rounded-3xl p-6 shadow-xl hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.75 1.75 0 013 15.546V12a9 9 0 0118 0v3.546zM12 4v1m0 0a9 9 0 00-9 9m9-9a9 9 0 019 9m-9-6v3" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Register Your Birthday</h3>
                    <p className="text-white/60 text-sm">Let us celebrate you!</p>
                  </div>
                </div>
                <svg 
                  className={`w-6 h-6 text-white/60 transition-transform duration-300 ${showBirthdayForm ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Birthday Form */}
            {showBirthdayForm && (
              <div className="mt-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl animate-slide-down">
                {birthdaySubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce-slow">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Birthday Registered!</h3>
                    <p className="text-white/60 mb-6">We can&apos;t wait to celebrate with you!</p>
                    <button
                      onClick={() => setBirthdaySubmitted(false)}
                      className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
                    >
                      Register Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBirthdaySubmit} className="space-y-5">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/30 to-orange-500/30 rounded-full border border-white/20">
                        <span className="text-2xl"></span>
                        <span className="text-white font-medium">Birthday Registration</span>
                        <span className="text-2xl"></span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-pink-300 font-medium mb-2 text-sm">Full Name</label>
                        <input
                          type="text"
                          required
                          value={birthdayData.fullName}
                          onChange={(e) => setBirthdayData({ ...birthdayData, fullName: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 font-medium mb-2 text-sm">Date of Birth</label>
                        <input
                          type="date"
                          required
                          value={birthdayData.dateOfBirth}
                          onChange={(e) => setBirthdayData({ ...birthdayData, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-pink-300 font-medium mb-2 text-sm">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={birthdayData.phoneNumber}
                          onChange={(e) => setBirthdayData({ ...birthdayData, phoneNumber: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all"
                          placeholder="e.g., +27 xxx xxx xxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-pink-300 font-medium mb-2 text-sm">Email Address</label>
                        <input
                          type="email"
                          required
                          value={birthdayData.email}
                          onChange={(e) => setBirthdayData({ ...birthdayData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 focus:outline-none transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={birthdayLoading}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white font-bold text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {birthdayLoading ? (
                        "Registering..."
                      ) : (
                        <>
                          <span></span>
                          Register My Birthday
                          <span></span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
         
        </div>
      </div>
    </div>
  );
}
