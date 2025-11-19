"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "1",
    guestNames: ["", "", "", "", ""], // Array for up to 5 guest names
    ticketType: "", // "vip" or "regular"
    dietaryRequirement: "none", // "none", "vegan", "vegetarian"
    allergies: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

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

  const handleTicketSelection = (type: "vip" | "regular" | "vip-plus") => {
    setFormData({
      ...formData,
      ticketType: type,
      // For VIP+ONE, automatically set guests to 1 (the plus one)
      guests: type === "vip-plus" ? "1" : formData.guests,
    });
    setShowLanding(false);
  };

  const handleGuestNameChange = (index: number, value: string) => {
    const newGuestNames = [...formData.guestNames];
    newGuestNames[index] = value;
    setFormData({
      ...formData,
      guestNames: newGuestNames,
    });
  };

  // Landing Page
  if (showLanding) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Fixed background image */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            opacity: 0.5,
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12 fade-in">
            <div className="float-animation mb-8">
              <Image
                src="/logo.png"
                alt="CCC Logo"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center px-4">
                <div className="relative w-full max-w-5xl">
                  <Image
                    src="/galayouth.png"
                    alt="Youth Gala"
                    width={1400}
                    height={500}
                    className="w-full h-auto relative z-10"
                    style={{ 
                      filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 0 40px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 80px rgba(255, 215, 0, 0.5))',
                    }}
                    priority
                  />
                </div>
              </div>
              <div className="flex justify-center -mt-2">
                <Image
                  src="/theme.png"
                  alt="Theme: Royalty"
                  width={450}
                  height={120}
                  className="h-auto"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white mb-8">
              <div className="flex items-center gap-2">
                <span className="text-3xl md:text-5xl font-bold gold-shimmer">29TH</span>
                <span className="text-lg md:text-xl">NOV 2025</span>
              </div>
              <div className="hidden md:block w-px h-12 bg-[#D4AF37]"></div>
              <div className="text-xl md:text-2xl font-bold">
                <span className="gold-shimmer">DRESS CODE: ROYAL ATTIRE</span>
              </div>
            </div>

            {/* Moodboard Button */}
            <div className="text-center mb-12 fade-in">
              <a
                href="/moodboard"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold text-xl rounded-lg hover:scale-110 transform transition-all duration-300 shadow-2xl hover:shadow-[#FFD700]/50 glow-effect"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                MOODBOARD
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <p className="text-white/60 text-sm mt-3">View Royal Attire Inspiration</p>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Choose Your <span className="gold-shimmer">Ticket Type</span>
            </h2>

            {/* Ticket Selection Cards */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 px-4">
              {/* Regular Ticket */}
              <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/50">
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-3">REGULAR</h3>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">R500</span>
                  <p className="text-white/70 mt-1 text-sm">per person</p>
                </div>
                <ul className="text-white/80 space-y-2 mb-6 text-sm min-h-[200px]">
                  <li className="flex items-start">
                    <span className="text-[#D4AF37] mr-2">✓</span>
                    <span>Reserved Seat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D4AF37] mr-2">✓</span>
                    <span>Photo Session</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D4AF37] mr-2">✓</span>
                    <span>Full Access to the event and dinner</span>
                  </li>
                </ul>
                <button
                  onClick={() => handleTicketSelection("regular")}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold text-base rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/50"
                >
                  SELECT REGULAR
                </button>
              </div>

              {/* VIP Ticket */}
              <div className="bg-gradient-to-br from-zinc-900 to-black border-4 border-[#FFD700] rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black px-6 py-2 rounded-full font-bold text-xs">
                  PREMIUM
                </div>
                <h3 className="text-2xl font-bold text-[#FFD700] mb-3 mt-4">VIP</h3>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">R1500</span>
                  <p className="text-white/70 mt-1 text-sm">per person</p>
                </div>
                <ul className="text-white/80 space-y-2 mb-6 text-sm min-h-[200px]">
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">✓</span>
                    <span>Official Sponsor of 2025 Dinner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">✓</span>
                    <span>1+ Reserved Seat</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">✓</span>
                    <span>Business advert placement on Screen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">✓</span>
                    <span>Private photo session to be delivered in the night</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">✓</span>
                    <span>Full Access to the event and dinner</span>
                  </li>
                </ul>
                <button
                  onClick={() => handleTicketSelection("vip")}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#B8941E] text-black font-bold text-base rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#FFD700]/50"
                >
                  SELECT VIP
                </button>
              </div>

              {/* VIP Plus-One Package */}
              <div className="bg-gradient-to-br from-zinc-900 to-black border-4 border-[#FF6B35] rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF6B35]/50 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#FF6B35] text-black px-6 py-2 rounded-full font-bold text-xs">
                  EXCLUSIVE
                </div>
                <h3 className="text-xl font-bold text-[#FF6B35] mb-2 mt-4">VIP PLUS-ONE</h3>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">R2000</span>
                  <p className="text-white/70 mt-1 text-sm">per person</p>
                </div>
                <ul className="text-white/80 space-y-2 mb-6 text-sm min-h-[200px]">
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>Official Sponsor of 2025 Dinner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>Designed for Couples or those attending with a date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>2+ Reserved Seats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>Business advert placement on Screen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>Joint private photo session to be delivered in the night</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF6B35] mr-2">✓</span>
                    <span>Full Access to the event and dinner</span>
                  </li>
                </ul>
                <button
                  onClick={() => handleTicketSelection("vip-plus")}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#FF6B35] via-[#FFD700] to-[#FF6B35] text-black font-bold text-base rounded-lg hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#FF6B35]/50"
                >
                  SELECT VIP PLUS-ONE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-3xl w-full text-center fade-in">
          {/* Logo at Top */}
          <div className="flex justify-center items-center mb-8 float-animation">
            <div className="w-20 h-20 md:w-24 md:h-24 relative bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-[#D4AF37] p-3">
              <Image
                src="/logo.png"
                alt="CCC Logo"
                width={80}
                height={80}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight" style={{ 
            background: 'linear-gradient(90deg, #B8941E 0%, #D4AF37 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            THANK YOU!
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-4">
            Your invitation has been confirmed
          </p>
          
          <p className="text-lg md:text-xl text-[#D4AF37] mb-10">
            We look forward to seeing you at the Youth Gala
          </p>
          
          <div className="bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] p-8 rounded-xl max-w-2xl mx-auto">
            <p className="text-black font-bold text-2xl md:text-3xl mb-2">29TH NOVEMBER 2025</p>
            <p className="text-black/80 font-semibold text-lg">Gates Open at 5pm</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fixed background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/background.png)',
          opacity: 0.5,
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
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
           
            <div className="flex justify-center px-4">
              <div className="relative w-full max-w-5xl">
                <Image
                  src="/galayouth.png"
                  alt="Youth Gala"
                  width={1400}
                  height={500}
                  className="w-full h-auto relative z-10"
                  style={{ 
                    filter: 'brightness(1.2) contrast(1.3) drop-shadow(0 0 40px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 80px rgba(255, 215, 0, 0.5))',
                  }}
                  priority
                />
              </div>
            </div>
            <div className="flex justify-center -mt-2">
              <Image
                src="/theme.png"
                alt="Theme: Royalty"
                width={350}
                height={95}
                className="h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-white mb-8">
            <div className="flex items-center gap-2">
              <span className="text-3xl md:text-5xl font-bold gold-shimmer">29TH</span>
              <span className="text-lg md:text-xl">NOV 2025</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-[#D4AF37]"></div>
            <div className="text-xl md:text-2xl font-bold">
              <span className="gold-shimmer">Gates Open at 5pm</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-2xl p-8 md:p-12 shadow-2xl glow-effect">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 gold-shimmer">
              RSVP NOW
            </h2>
            <p className="text-center text-white/70 mb-4">
              Secure your spot at the most prestigious youth event of the year
            </p>
            
            {/* Show selected ticket type */}
            <div className="text-center mb-8 p-4 bg-gradient-to-r from-[#B8941E]/20 via-[#D4AF37]/20 to-[#FFD700]/20 border border-[#D4AF37] rounded-lg">
              <p className="text-white/70 text-sm mb-1">Selected Ticket:</p>
              <p className="text-2xl font-bold gold-shimmer">
                {formData.ticketType === "vip" ? "VIP - R1500" : formData.ticketType === "vip-plus" ? "VIP PLUS-ONE - R2000" : "REGULAR - R500"}
              </p>
              <p className="text-white/60 text-sm mt-1">per person</p>
            </div>

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
                  placeholder="your.name@email.com"
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

              {/* VIP+ONE has fixed 1 guest, others can select */}
              {formData.ticketType === "vip-plus" ? (
                <div className="fade-in bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-lg p-6" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="text-[#FF6B35] font-bold text-lg">VIP Plus-One Package</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-2">This ticket includes you + 1 guest for a total of R2000</p>
                  <div className="bg-black/30 rounded-lg p-4 border border-[#FF6B35]/20">
                    <p className="text-white/60 text-xs mb-1">Total People:</p>
                    <p className="text-white font-bold text-lg">2 People (You + Plus One)</p>
                    <p className="text-[#FF6B35] font-bold text-xl mt-2">Total: R2,000</p>
                  </div>
                </div>
              ) : (
                <div className="fade-in" style={{ animationDelay: "0.3s" }}>
                  <label htmlFor="guests" className="block text-[#D4AF37] font-semibold mb-2">
                    Additional Guests (Excluding Yourself) *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  >
                    <option value="0">0 Additional Guests (Just Me)</option>
                    <option value="1">1 Additional Guest (2 People Total)</option>
                    <option value="2">2 Additional Guests (3 People Total)</option>
                    <option value="3">3 Additional Guests (4 People Total)</option>
                    <option value="4">4 Additional Guests (5 People Total)</option>
                  </select>
                </div>
              )}

              {/* Guest Names Section */}
              {parseInt(formData.guests) > 0 && (
                <div className={`fade-in ${formData.ticketType === "vip-plus" ? "bg-[#FF6B35]/10 border-[#FF6B35]/30" : "bg-[#D4AF37]/10 border-[#D4AF37]/30"} border rounded-lg p-6`} style={{ animationDelay: "0.35s" }}>
                  <h3 className={`${formData.ticketType === "vip-plus" ? "text-[#FF6B35]" : "text-[#D4AF37]"} font-bold text-lg mb-4`}>
                    {formData.ticketType === "vip-plus" ? "Enter Full Name" : "Additional Guest Names"}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {formData.ticketType === "vip-plus" 
                      ? "Please provide the full name" 
                      : "Please provide the full names of your additional guests (not including yourself)"}
                  </p>
                  <div className="space-y-3">
                    {Array.from({ length: parseInt(formData.guests) }).map((_, index) => (
                      <div key={index}>
                        <label htmlFor={`guest-${index}`} className="block text-white/80 font-medium mb-1 text-sm">
                          {formData.ticketType === "vip-plus" ? "Full Name *" : `Guest ${index + 1} *`}
                        </label>
                        <input
                          type="text"
                          id={`guest-${index}`}
                          required
                          value={formData.guestNames[index]}
                          onChange={(e) => handleGuestNameChange(index, e.target.value)}
                          className={`w-full px-4 py-2.5 bg-black/50 border-2 ${formData.ticketType === "vip-plus" ? "border-[#FF6B35]/30 focus:border-[#FF6B35] focus:ring-[#FF6B35]/50" : "border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-[#D4AF37]/50"} rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 transition-all`}
                          placeholder={formData.ticketType === "vip-plus" ? "Enter full name" : "Full Name"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="fade-in" style={{ animationDelay: "0.4s" }}>
                <label htmlFor="dietaryRequirement" className="block text-[#D4AF37] font-semibold mb-2">
                  Dietary Requirement
                </label>
                <select
                  id="dietaryRequirement"
                  name="dietaryRequirement"
                  value={formData.dietaryRequirement}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                >
                  <option value="none">None</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </div>

              <div className="fade-in" style={{ animationDelay: "0.5s" }}>
                <label htmlFor="allergies" className="block text-[#D4AF37] font-semibold mb-2">
                  Allergies (if any)
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                  placeholder="e.g., Peanuts, Shellfish, etc."
                />
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
