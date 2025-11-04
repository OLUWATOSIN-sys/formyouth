"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit registration. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center fade-in">
          <div className="float-animation mb-8">
            <Image
              src="/logo.png"
              alt="CCC Logo"
              width={150}
              height={150}
              className="mx-auto"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gold-shimmer">
            THANK YOU!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            Your invitation has been confirmed
          </p>
          <p className="text-lg text-[#D4AF37] mb-8">
            We look forward to seeing you at the Youth Gala
          </p>
          <div className="bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] p-6 rounded-lg">
            <p className="text-black font-bold text-xl mb-2">29TH NOVEMBER 2025</p>
            <p className="text-black font-semibold">Gates Open @ R500</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in">
          <div className="float-animation mb-8">
            <Image
              src="/logo.png"
              alt="CCC Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          
          <div className="mb-6">
           
            <div className="flex justify-center mb-4 px-4">
              <div className="relative w-full max-w-4xl">
                <Image
                  src="/galayouth.png"
                  alt="Youth Gala"
                  width={1200}
                  height={400}
                  className="w-full h-auto relative z-10"
                  style={{ 
                    filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 0 40px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 80px rgba(255, 215, 0, 0.5))',
                  }}
                  priority
                />
              </div>
            </div>
            <p className="text-[#FFD700] text-xl md:text-2xl font-bold tracking-wider">
              THEME: ROYALTY
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white mb-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl md:text-5xl font-bold gold-shimmer">29TH</span>
              <span className="text-lg md:text-xl">NOV 2025</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-[#D4AF37]"></div>
            <div className="text-xl md:text-2xl font-bold">
              <span className="text-[#D4AF37]">Gates @</span> R500
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-2xl p-8 md:p-12 shadow-2xl glow-effect">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 gold-shimmer">
              RSVP NOW
            </h2>
            <p className="text-center text-white/70 mb-8">
              Secure your spot at the most prestigious youth event of the year
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="fade-in">
                <label htmlFor="name" className="block text-[#D4AF37] font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="fade-in" style={{ animationDelay: "0.1s" }}>
                <label htmlFor="email" className="block text-[#D4AF37] font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="fade-in" style={{ animationDelay: "0.2s" }}>
                <label htmlFor="phone" className="block text-[#D4AF37] font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  placeholder="+27 XX XXX XXXX"
                />
              </div>

              <div className="fade-in" style={{ animationDelay: "0.3s" }}>
                <label htmlFor="guests" className="block text-[#D4AF37] font-semibold mb-2">
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold text-lg rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/50 fade-in disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{ animationDelay: "0.4s" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SUBMITTING...
                  </>
                ) : (
                  "CONFIRM ATTENDANCE"
                )}
              </button>
            </form>

         
          </div>
        </div>

        {/* Footer */}
       
      </div>
    </div>
  );
}
