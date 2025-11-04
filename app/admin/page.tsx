"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  timestamp: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const ADMIN_PASSWORD = "YouthGala2025!"; // Change this to your secure password

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchRegistrations();
    } else {
      alert("Incorrect password!");
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/registrations");
      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
    setLoading(false);
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm)
  );

  const totalGuests = registrations.reduce(
    (sum, reg) => sum + parseInt(reg.guests),
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="CCC Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold gold-shimmer mb-2">Admin Portal</h1>
            <p className="text-white/70">Youth Gala 2025 - Registration Management</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-8"
          >
            <label htmlFor="password" className="block text-[#D4AF37] font-semibold mb-2">
              Admin Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all mb-6"
              placeholder="Enter admin password"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold text-lg rounded-lg hover:scale-105 transform transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Image src="/logo.png" alt="CCC Logo" width={60} height={60} />
            <div>
              <h1 className="text-3xl font-bold gold-shimmer">Admin Dashboard</h1>
              <p className="text-white/70">Youth Gala 2025 Registrations</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Total Registrations</p>
            <p className="text-4xl font-bold text-[#D4AF37]">{registrations.length}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Total Guests</p>
            <p className="text-4xl font-bold text-[#FFD700]">{totalGuests}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Expected Revenue</p>
            <p className="text-4xl font-bold text-[#B8941E]">R{totalGuests * 500}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white placeholder-white/30 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
          />
        </div>

        {/* Registrations Table */}
        <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#D4AF37]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Guests</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/70">
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/70">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg.id}
                      className="border-t border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{index + 1}</td>
                      <td className="px-6 py-4 text-white font-medium">{reg.name}</td>
                      <td className="px-6 py-4 text-white/80">{reg.email}</td>
                      <td className="px-6 py-4 text-white/80">{reg.phone}</td>
                      <td className="px-6 py-4 text-[#D4AF37] font-semibold">{reg.guests}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(reg.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              const csv = [
                ["Name", "Email", "Phone", "Guests", "Date"],
                ...registrations.map((reg) => [
                  reg.name,
                  reg.email,
                  reg.phone,
                  reg.guests,
                  new Date(reg.timestamp).toLocaleString(),
                ]),
              ]
                .map((row) => row.join(","))
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `youth-gala-registrations-${new Date().toISOString()}.csv`;
              a.click();
            }}
            className="px-8 py-3 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg hover:scale-105 transform transition-all duration-300"
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}
