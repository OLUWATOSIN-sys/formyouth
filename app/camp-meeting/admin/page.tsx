"use client";

import { useState, useEffect } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

interface CampAttendee {
  _id: string;
  date: string;
  fullName: string;
  gender: string;
  parish: string;
  phone: string;
  signedIn: boolean;
  signInTime: string;
  signOutTime: string | null;
  createdAt: string;
}

export default function CampMeetingAdminPage() {
  const [attendees, setAttendees] = useState<CampAttendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState<"all" | "signedIn" | "signedOut">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetchAttendees();
    }
  }, [authenticated]);

  const fetchAttendees = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/camp-meeting");
      const data = await response.json();
      setAttendees(data);
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleSignIn = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/camp-meeting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          action: currentStatus ? "signOut" : "signIn" 
        }),
      });
      fetchAttendees();
    } catch (error) {
      console.error("Error toggling sign-in:", error);
    }
  };

  const deleteAttendee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attendee?")) return;
    try {
      await fetch(`/api/camp-meeting?id=${id}`, {
        method: "DELETE",
      });
      fetchAttendees();
    } catch (error) {
      console.error("Error deleting attendee:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAuthenticated(true);
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const getFilteredAttendees = () => {
    let filtered = attendees;
    
    if (filter === "signedIn") filtered = filtered.filter(a => a.signedIn);
    if (filter === "signedOut") filtered = filtered.filter(a => !a.signedIn);
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.parish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.phone.includes(searchTerm)
      );
    }
    
    return filtered;
  };

  const stats = {
    total: attendees.length,
    signedIn: attendees.filter(a => a.signedIn).length,
    signedOut: attendees.filter(a => !a.signedIn).length,
    parishes: [...new Set(attendees.map(a => a.parish))].length,
    males: attendees.filter(a => a.gender === "Male").length,
    females: attendees.filter(a => a.gender === "Female").length,
  };

  if (!authenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url('/camp-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-orange-900/70 to-red-900/80" />
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold text-white mb-2 ${anton.className}`}>
              Camp Meeting Admin
            </h1>
            <p className="text-amber-200/80">CAVE OF ADULLAM 2026</p>
          </div>

          <form onSubmit={handleLogin} className="backdrop-blur-xl bg-white/10 border border-amber-400/30 rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-amber-300 font-medium mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-amber-400/30 rounded-xl text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-slate-900/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold text-white ${anton.className}`}>
                Camp Meeting Admin
              </h1>
              <p className="text-amber-400/80 text-sm">CAVE OF ADULLAM 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAttendees}
                disabled={refreshing}
                className="p-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white/60 hover:text-white hover:bg-white/[0.1] transition-all disabled:opacity-50"
              >
                <svg className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <a 
                href="/camp-meeting" 
                className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-white/[0.1] rounded-xl text-white/70 hover:text-white hover:bg-white/[0.1] transition-all font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Sign-In Page
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-amber-400">{stats.total}</p>
            <p className="text-white/50 text-sm">Total</p>
          </div>
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-green-400">{stats.signedIn}</p>
            <p className="text-white/50 text-sm">Signed In</p>
          </div>
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-gray-400">{stats.signedOut}</p>
            <p className="text-white/50 text-sm">Signed Out</p>
          </div>
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-blue-400">{stats.parishes}</p>
            <p className="text-white/50 text-sm">Parishes</p>
          </div>
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-indigo-400">{stats.males}</p>
            <p className="text-white/50 text-sm">Males</p>
          </div>
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5">
            <p className="text-4xl font-black text-pink-400">{stats.females}</p>
            <p className="text-white/50 text-sm">Females</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, parish, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-white/40 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "signedIn", "signedOut"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  filter === f
                    ? f === "signedIn"
                      ? "bg-green-500 text-white"
                      : f === "signedOut"
                      ? "bg-gray-500 text-white"
                      : "bg-amber-500 text-white"
                    : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] border border-white/[0.1]"
                }`}
              >
                {f === "all" ? "All" : f === "signedIn" ? "In" : "Out"}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading attendees...</p>
          </div>
        ) : getFilteredAttendees().length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-amber-500/20 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Attendees Found</h3>
            <p className="text-white/50">
              {searchTerm ? "Try a different search term" : "Camp meeting registrations will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {getFilteredAttendees().map((attendee) => (
              <div
                key={attendee._id}
                className="backdrop-blur-xl bg-white/[0.05] border border-white/[0.1] rounded-2xl p-6 hover:bg-white/[0.08] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/[0.1] ${
                      attendee.gender === "Male" 
                        ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20" 
                        : "bg-gradient-to-br from-pink-500/20 to-rose-500/20"
                    }`}>
                      <svg className={`w-7 h-7 ${attendee.gender === "Male" ? "text-blue-400" : "text-pink-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{attendee.fullName}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-white/50 text-sm">{attendee.parish}</span>
                        <span className="text-white/50 text-sm">{attendee.phone}</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          attendee.gender === "Male" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"
                        }`}>
                          {attendee.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                      attendee.signedIn 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}>
                      {attendee.signedIn ? "Signed In" : "Signed Out"}
                    </span>
                    <button
                      onClick={() => toggleSignIn(attendee._id, attendee.signedIn)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        attendee.signedIn
                          ? "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border border-gray-500/30"
                          : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                      }`}
                    >
                      {attendee.signedIn ? "Sign Out" : "Sign In"}
                    </button>
                    <button
                      onClick={() => deleteAttendee(attendee._id)}
                      className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-wrap gap-4 text-white/40 text-sm">
                  <span>Date: {new Date(attendee.date).toLocaleDateString()}</span>
                  <span>Sign-in: {new Date(attendee.signInTime).toLocaleTimeString()}</span>
                  {attendee.signOutTime && (
                    <span>Sign-out: {new Date(attendee.signOutTime).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
