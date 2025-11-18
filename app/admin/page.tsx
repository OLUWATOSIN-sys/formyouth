"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  guestNames: string[];
  ticketType: "vip" | "regular" | "vip-plus";
  dietaryRequirement: string;
  allergies: string;
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
  const [ticketFilter, setTicketFilter] = useState<"all" | "regular" | "vip" | "vip-plus">("all");

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
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold whitespace-nowrap">
            Paid
          </span>
        );
      case "proof_uploaded":
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold whitespace-nowrap">
            Proof Up
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold whitespace-nowrap">
            Not Paid
          </span>
        );
    }
  };

  const filteredRegistrations = registrations.filter(
    (reg) => {
      const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm);
      const matchesFilter = ticketFilter === "all" || reg.ticketType === ticketFilter;
      return matchesSearch && matchesFilter;
    }
  );

  const totalGuests = registrations.reduce(
    (sum, reg) => sum + parseInt(reg.guests),
    0
  );

  const expectedRevenue = registrations.reduce(
    (sum, reg) => {
      const totalPeople = parseInt(reg.guests) + 1; // Add 1 for the registrant
      const pricePerPerson = reg.ticketType === "vip" ? 1500 : reg.ticketType === "vip-plus" ? 2000 : 500;
      return sum + (totalPeople * pricePerPerson);
    },
    0
  );

  const paidCount = registrations.filter(
    (reg) => reg.paymentStatus === "confirmed"
  ).length;

  const regularCount = registrations.filter((reg) => reg.ticketType === "regular").length;
  const vipCount = registrations.filter((reg) => reg.ticketType === "vip").length;
  const vipPlusCount = registrations.filter((reg) => reg.ticketType === "vip-plus").length;

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
            <p className="text-4xl font-bold text-[#B8941E]">R{expectedRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Ticket Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">Regular Tickets</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{regularCount}</p>
            <p className="text-white/50 text-xs mt-1">R500 per person</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">VIP Tickets</p>
            <p className="text-3xl font-bold text-[#FFD700]">{vipCount}</p>
            <p className="text-white/50 text-xs mt-1">R1500 per person</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FF6B35] rounded-xl p-6">
            <p className="text-white/70 text-sm mb-1">VIP Plus-One Tickets</p>
            <p className="text-3xl font-bold text-[#FF6B35]">{vipPlusCount}</p>
            <p className="text-white/50 text-xs mt-1">R2000 per person</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setTicketFilter("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                ticketFilter === "all"
                  ? "bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black"
                  : "bg-zinc-800 text-white/70 hover:bg-zinc-700"
              }`}
            >
              All Tickets ({registrations.length})
            </button>
            <button
              onClick={() => setTicketFilter("regular")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                ticketFilter === "regular"
                  ? "bg-[#D4AF37] text-black"
                  : "bg-zinc-800 text-[#D4AF37] hover:bg-zinc-700 border border-[#D4AF37]/30"
              }`}
            >
              Regular ({regularCount})
            </button>
            <button
              onClick={() => setTicketFilter("vip")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                ticketFilter === "vip"
                  ? "bg-[#FFD700] text-black"
                  : "bg-zinc-800 text-[#FFD700] hover:bg-zinc-700 border border-[#FFD700]/30"
              }`}
            >
              VIP ({vipCount})
            </button>
            <button
              onClick={() => setTicketFilter("vip-plus")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                ticketFilter === "vip-plus"
                  ? "bg-[#FF6B35] text-black"
                  : "bg-zinc-800 text-[#FF6B35] hover:bg-zinc-700 border border-[#FF6B35]/30"
              }`}
            >
              VIP Plus-One ({vipPlusCount})
            </button>
          </div>

          {/* Search Bar */}
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
            <table className="w-full table-auto">
              <thead className="bg-[#D4AF37]/10">
                <tr>
                  <th className="px-3 py-4 text-left text-[#D4AF37] font-semibold text-sm w-12">#</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm min-w-[150px]">Name</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm min-w-[200px]">Email</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm min-w-[130px]">Phone</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-24">Ticket</th>
                  <th className="px-4 py-4 text-center text-[#D4AF37] font-semibold text-sm w-20">Guests</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-28">Amount</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm min-w-[180px]">Guest Names</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-24">Diet</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-28">Allergies</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-28">Status</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm min-w-[140px]">Date</th>
                  <th className="px-4 py-4 text-left text-[#D4AF37] font-semibold text-sm w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-white/70">
                      Loading registrations...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-white/70">
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg, index) => (
                    <tr
                      key={reg._id}
                      className="border-t border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 transition-colors"
                    >
                      <td className="px-3 py-3 text-white text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-white font-medium text-sm">{reg.name}</td>
                      <td className="px-4 py-3 text-white/80 text-sm">{reg.email}</td>
                      <td className="px-4 py-3 text-white/80 text-sm">{reg.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                          reg.ticketType === "vip" 
                            ? "bg-[#FFD700]/20 text-[#FFD700]" 
                            : reg.ticketType === "vip-plus"
                            ? "bg-[#FF6B35]/20 text-[#FF6B35]"
                            : "bg-[#D4AF37]/20 text-[#D4AF37]"
                        }`}>
                          {reg.ticketType === "vip" ? "VIP" : reg.ticketType === "vip-plus" ? "VIP+" : "Regular"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#D4AF37] font-semibold text-sm text-center">{reg.guests}</td>
                      <td className="px-4 py-3">
                        <span className="text-[#FFD700] font-bold text-base whitespace-nowrap">
                          R{((parseInt(reg.guests) + 1) * (reg.ticketType === "vip" ? 1500 : reg.ticketType === "vip-plus" ? 2000 : 500)).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white/80 text-xs max-w-[180px]">
                          {reg.guestNames && reg.guestNames.length > 0 ? (
                            <div className="space-y-1">
                              {reg.guestNames.filter(name => name.trim()).map((name, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span className="text-[#D4AF37] font-semibold">{idx + 1}.</span>
                                  <span>{name}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-white/40">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/80 capitalize text-xs">{reg.dietaryRequirement || "None"}</td>
                      <td className="px-4 py-3 text-white/80 text-xs">{reg.allergies || "-"}</td>
                      <td className="px-4 py-3">{getStatusBadge(reg.paymentStatus)}</td>
                      <td className="px-4 py-3 text-white/60 text-xs whitespace-nowrap">
                        {new Date(reg.timestamp).toLocaleDateString('en-ZA', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {reg.paymentStatus === "proof_uploaded" && reg.proofOfPayment && (
                            <>
                              <button
                                onClick={() => viewProof(reg.proofOfPayment!)}
                                className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-xs whitespace-nowrap flex items-center justify-center"
                                title="View Proof"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleConfirmPayment(reg._id)}
                                disabled={actionLoading === `confirm-${reg._id}`}
                                className="px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
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
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteRegistration(reg._id)}
                            disabled={actionLoading === `delete-${reg._id}`}
                            className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
                            title="Delete"
                          >
                            {actionLoading === `delete-${reg._id}` ? (
                              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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
                ["Name", "Email", "Phone", "Ticket Type", "Guests", "Amount", "Payment Status", "Date"],
                ...registrations.map((reg) => {
                  const totalPeople = parseInt(reg.guests) + 1;
                  const pricePerPerson = reg.ticketType === "vip" ? 1500 : reg.ticketType === "vip-plus" ? 2000 : 500;
                  const amount = totalPeople * pricePerPerson;
                  const ticketLabel = reg.ticketType === "vip" ? "VIP" : reg.ticketType === "vip-plus" ? "VIP Plus-One" : "Regular";
                  return [
                    reg.name,
                    reg.email,
                    reg.phone,
                    ticketLabel,
                    reg.guests,
                    `R${amount.toLocaleString()}`,
                    reg.paymentStatus,
                    new Date(reg.timestamp).toLocaleString(),
                  ];
                }),
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
