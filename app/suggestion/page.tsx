"use client";

import { useState } from "react";

export default function SuggestionPage() {
  const [formData, setFormData] = useState({
    suggestion: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
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

          {/* Footer */}
         
        </div>
      </div>
    </div>
  );
}
