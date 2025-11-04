"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  timestamp: string;
  paymentStatus: "not_paid" | "proof_uploaded" | "confirmed";
  proofOfPayment: string | null;
  proofUploadedAt: string | null;
  paymentConfirmedAt: string | null;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const ADMIN_PASSWORD = "YouthGala2025!";
  const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

  // Session management
  useEffect(() => {
    const sessionStart = localStorage.getItem("adminSessionStart");
    if (sessionStart) {
      const elapsed = Date.now() - parseInt(sessionStart);
      if (elapsed < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        fetchRegistrations();
        startSessionTimer();
      } else {
        localStorage.removeItem("adminSessionStart");
      }
    }
  }, []);

  const startSessionTimer = () => {
    const timer = setInterval(() => {
      const sessionStart = localStorage.getItem("adminSessionStart");
      if (sessionStart) {
        const elapsed = Date.now() - parseInt(sessionStart);
        if (elapsed >= SESSION_TIMEOUT) {
          handleLogout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminSessionStart", Date.now().toString());
      fetchRegistrations();
      startSessionTimer();
    } else {
      alert("Incorrect password!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminSessionStart");
    setRegistrations([]);
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

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    setActionLoading(`delete-${id}`);
    try {
      const response = await fetch("/api/admin/delete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchRegistrations();
      } else {
        alert("Failed to delete registration");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmPayment = async (id: string) => {
    if (!confirm("Confirm that payment has been received?")) return;

    setActionLoading(`confirm-${id}`);
    try {
      const response = await fetch("/api/admin/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchRegistrations();
      } else {
        alert("Failed to confirm payment");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const viewProof = (proofImage: string) => {
    setSelectedProof(proofImage);
    setShowProofModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
            ✓ Paid
          </span>
        );
      case "proof_uploaded":
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
            ⏳ Proof Uploaded
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold">
            ✗ Not Paid
          </span>
        );
    }
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

  const paidCount = registrations.filter(
    (r) => r.paymentStatus === "confirmed"
  ).length;

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
            <p className="text-white/50 text-sm mt-4 text-center">
              Session expires after 15 minutes of inactivity
            </p>
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
            onClick={handleLogout}
            className="px-6 py-2 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Total Registrations</p>
            <p className="text-4xl font-bold text-[#D4AF37]">{registrations.length}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Total Guests</p>
            <p className="text-4xl font-bold text-[#FFD700]">{totalGuests}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Confirmed Paid</p>
            <p className="text-4xl font-bold text-green-400">{paidCount}</p>
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
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-[#D4AF37] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-white/70">
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-white/70">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg._id}
                      className="border-t border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{index + 1}</td>
                      <td className="px-6 py-4 text-white font-medium">{reg.name}</td>
                      <td className="px-6 py-4 text-white/80">{reg.email}</td>
                      <td className="px-6 py-4 text-white/80">{reg.phone}</td>
                      <td className="px-6 py-4 text-[#D4AF37] font-semibold">{reg.guests}</td>
                      <td className="px-6 py-4">{getStatusBadge(reg.paymentStatus)}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(reg.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {reg.paymentStatus === "proof_uploaded" && reg.proofOfPayment && (
                            <button
                              onClick={() => handleConfirmPayment(reg._id)}
                              disabled={actionLoading === `confirm-${reg._id}`}
                              className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              title="Confirm Payment"
                            >
                              {actionLoading === `confirm-${reg._id}` ? (
                                <>
                                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </>
                              ) : (
                                "✓ Confirm"
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRegistration(reg._id)}
                            disabled={actionLoading === `delete-${reg._id}`}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            title="Delete"
                          >
                            {actionLoading === `delete-${reg._id}` ? (
                              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              "🗑️"
                            )}
                          </button>
                        </div>
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
                ["Name", "Email", "Phone", "Guests", "Payment Status", "Date"],
                ...registrations.map((reg) => [
                  reg.name,
                  reg.email,
                  reg.phone,
                  reg.guests,
                  reg.paymentStatus,
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

      {/* Proof Modal */}
      {showProofModal && selectedProof && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
          onClick={() => setShowProofModal(false)}
        >
          <div className="max-w-4xl w-full bg-zinc-900 border-2 border-[#D4AF37] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-[#D4AF37]">Proof of Payment</h3>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-white/70 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <img
              src={selectedProof}
              alt="Proof of payment"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
