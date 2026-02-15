"use client";

import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  suggestion: string;
  category: string;
  createdAt: string;
  status: "new" | "reviewed" | "implemented";
}

interface Birthday {
  id: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  image: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  
  // Birthday state
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [activeTab, setActiveTab] = useState<"suggestions" | "birthdays">("suggestions");
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchSuggestions();
      fetchBirthdays();
    }
  }, [authenticated]);

  const fetchSuggestions = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/suggestions");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBirthdays = async () => {
    try {
      const response = await fetch("/api/birthdays");
      const data = await response.json();
      setBirthdays(data);
    } catch (error) {
      console.error("Error fetching birthdays:", error);
    }
  };

  const deleteBirthday = async (id: string) => {
    if (!confirm("Are you sure you want to delete this birthday record?")) return;
    try {
      await fetch("/api/birthdays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSelectedBirthday(null);
      fetchBirthdays();
    } catch (error) {
      console.error("Error deleting birthday:", error);
    }
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    return birthdays.filter((b) => {
      const dob = new Date(b.dateOfBirth);
      const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      const diffTime = thisYearBday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setAuthenticated(true);
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (selectedSuggestion) {
        setSelectedSuggestion({ ...selectedSuggestion, status: status as Suggestion["status"] });
      }
      fetchSuggestions();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteSuggestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this suggestion?")) return;
    try {
      await fetch("/api/suggestions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setSelectedSuggestion(null);
      fetchSuggestions();
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const stats = {
    total: suggestions.length,
    new: suggestions.filter((s) => s.status === "new").length,
    reviewed: suggestions.filter((s) => s.status === "reviewed").length,
    implemented: suggestions.filter((s) => s.status === "implemented").length,
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-2xl bg-white/[0.08] border border-white/[0.15] rounded-[32px] p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
                <img
                  src="https://www.rccgheavensgate.org/wp-content/uploads/2022/01/cropped-Logo-2.png"
                  alt="RCCG Heavens Gate Logo"
                  className="relative w-24 h-24 mx-auto object-contain"
                />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Admin Portal</h1>
              <p className="text-white/50 text-lg">Secure access to suggestions</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-14 pr-5 py-5 bg-white/[0.05] border border-white/[0.1] rounded-2xl text-white placeholder-white/30 focus:border-purple-500/50 focus:bg-white/[0.08] focus:outline-none transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%] text-white font-bold text-lg rounded-2xl hover:bg-[position:100%_0] transition-all duration-500 shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Premium Header */}
        <header className="backdrop-blur-2xl bg-white/[0.03] border-b border-white/[0.08] sticky top-0 z-20">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-40" />
                  <img
                    src="https://www.rccgheavensgate.org/wp-content/uploads/2022/01/cropped-Logo-2.png"
                    alt="RCCG Heavens Gate Logo"
                    className="relative w-14 h-14 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Suggestions Dashboard</h1>
                  <p className="text-white/40 text-sm font-medium">RCCG Heavens Gate Youth</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchSuggestions}
                  disabled={refreshing}
                  className="p-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white/60 hover:text-white hover:bg-white/[0.1] transition-all disabled:opacity-50"
                >
                  <svg className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <a href="/suggestion" className="px-5 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white/70 hover:text-white hover:bg-white/[0.1] transition-all font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-10">
          {/* Main Section Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === "suggestions"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_8px_32px_rgba(168,85,247,0.4)]"
                  : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Suggestions
              <span className="px-2 py-1 bg-white/20 rounded-lg text-sm">{suggestions.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("birthdays")}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === "birthdays"
                  ? "bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white shadow-[0_8px_32px_rgba(249,115,22,0.4)]"
                  : "bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.1]"
              }`}
            >
              <span className="text-xl"></span>
              Birthdays
              <span className="px-2 py-1 bg-white/20 rounded-lg text-sm">{birthdays.length}</span>
              {getUpcomingBirthdays().length > 0 && (
                <span className="px-2 py-1 bg-green-500 rounded-lg text-xs animate-pulse">
                  {getUpcomingBirthdays().length} upcoming
                </span>
              )}
            </button>
          </div>

          {activeTab === "suggestions" && (
            <>
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/[0.1]">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.total}
                  </span>
                </div>
                <p className="text-white/50 font-semibold text-sm uppercase tracking-wider">Total</p>
              </div>
            </div>

            <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-white/[0.1]">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {stats.new}
                  </span>
                </div>
                <p className="text-white/50 font-semibold text-sm uppercase tracking-wider">New</p>
              </div>
            </div>

            <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-white/[0.1]">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    {stats.reviewed}
                  </span>
                </div>
                <p className="text-white/50 font-semibold text-sm uppercase tracking-wider">Reviewed</p>
              </div>
            </div>

            <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-white/[0.1]">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                    {stats.implemented}
                  </span>
                </div>
                <p className="text-white/50 font-semibold text-sm uppercase tracking-wider">Implemented</p>
              </div>
            </div>
          </div>

          {/* Premium Filter Tabs */}
          <div className="flex gap-2 mb-8 p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl inline-flex">
            {[
              { key: "all", label: "All", count: stats.total },
              { key: "new", label: "New", count: stats.new },
              { key: "reviewed", label: "Reviewed", count: stats.reviewed },
              { key: "implemented", label: "Implemented", count: stats.implemented },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === tab.key
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-0.5 rounded-full ${filter === tab.key ? "bg-white/20" : "bg-white/10"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Suggestions Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
              </div>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/[0.05] rounded-3xl flex items-center justify-center border border-white/[0.1]">
                <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-white/40 text-2xl font-medium">No suggestions found</p>
              <p className="text-white/30 mt-2">Check back later for new submissions</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestion(suggestion)}
                  className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 cursor-pointer hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-white/[0.1]">
                        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                        suggestion.status === "new" 
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                          : suggestion.status === "reviewed" 
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {suggestion.status}
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-base leading-relaxed line-clamp-4 mb-5 font-medium">
                      {suggestion.suggestion}
                    </p>
                    
                    <div className="flex items-center gap-2 text-white/30 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </>
          )}

          {/* Birthdays Section */}
          {activeTab === "birthdays" && (
            <>
              {/* Birthday Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white/50 font-semibold text-sm uppercase tracking-wider mb-2">Total Registered</p>
                      <span className="text-4xl font-black bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        {birthdays.length}
                      </span>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-white/[0.1]">
                      <span className="text-3xl"></span>
                    </div>
                  </div>
                </div>

                <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white/50 font-semibold text-sm uppercase tracking-wider mb-2">Upcoming (30 days)</p>
                      <span className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                        {getUpcomingBirthdays().length}
                      </span>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-white/[0.1]">
                      <span className="text-3xl">🎉</span>
                    </div>
                  </div>
                </div>

                <div className="group relative backdrop-blur-2xl bg-white/[0.05] border border-white/[0.1] rounded-3xl p-7 hover:bg-white/[0.08] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white/50 font-semibold text-sm uppercase tracking-wider mb-2">This Month</p>
                      <span className="text-4xl font-black bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        {birthdays.filter((b) => {
                          const dob = new Date(b.dateOfBirth);
                          return dob.getMonth() === new Date().getMonth();
                        }).length}
                      </span>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-white/[0.1]">
                      <span className="text-3xl">📅</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Birthday List */}
              {birthdays.length === 0 ? (
                <div className="text-center py-32">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/[0.05] rounded-3xl flex items-center justify-center border border-white/[0.1]">
                    <span className="text-5xl"></span>
                  </div>
                  <p className="text-white/40 text-2xl font-medium">No birthdays registered yet</p>
                  <p className="text-white/30 mt-2">Youth members can register on the suggestion page</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {birthdays.map((birthday, index) => {
                    const dob = new Date(birthday.dateOfBirth);
                    const today = new Date();
                    const thisYearBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                    const diffTime = thisYearBday.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isUpcoming = diffDays >= 0 && diffDays <= 30;
                    const isToday = diffDays === 0;

                    return (
                      <div
                        key={birthday.id}
                        onClick={() => setSelectedBirthday(birthday)}
                        className={`group relative backdrop-blur-2xl bg-white/[0.05] border rounded-3xl p-7 cursor-pointer hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] ${
                          isToday ? "border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]" : isUpcoming ? "border-green-500/30" : "border-white/[0.1]"
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {isToday && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-xs font-bold animate-bounce">
                            🎉 TODAY! 🎉
                          </div>
                        )}
                        {isUpcoming && !isToday && (
                          <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 rounded-full text-white text-xs font-bold">
                            In {diffDays} days
                          </div>
                        )}
                        
                        <div className="flex items-start gap-4">
                          {birthday.image ? (
                            <img
                              src={birthday.image}
                              alt={birthday.fullName}
                              className="w-14 h-14 object-cover rounded-2xl border border-white/[0.1]"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-2xl flex items-center justify-center border border-white/[0.1]">
                              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">{birthday.fullName}</h3>
                            <p className="text-white/50 text-sm">
                              {new Date(birthday.dateOfBirth).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2">
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {birthday.phoneNumber}
                          </div>
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {birthday.email}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Premium Modal */}
      {selectedSuggestion && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedSuggestion(null)}
        >
          <div 
            className="w-full max-w-2xl backdrop-blur-2xl bg-slate-900/95 border border-white/[0.15] rounded-[32px] p-10 max-h-[90vh] overflow-y-auto shadow-[0_32px_128px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center border border-white/[0.1]">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="w-12 h-12 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 text-white/40 text-sm mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(selectedSuggestion.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div className="mb-10">
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">Suggestion Content</p>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
                <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">{selectedSuggestion.suggestion}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">Update Status</p>
              <div className="grid grid-cols-3 gap-3">
                {(["new", "reviewed", "implemented"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedSuggestion.id, status)}
                    className={`py-4 rounded-2xl font-bold uppercase text-sm tracking-wider transition-all duration-300 ${
                      selectedSuggestion.status === status
                        ? status === "new"
                          ? "bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
                          : status === "reviewed"
                          ? "bg-amber-500 text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)]"
                          : "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
                        : "bg-white/[0.05] text-white/50 hover:bg-white/[0.1] hover:text-white border border-white/[0.1]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => deleteSuggestion(selectedSuggestion.id)}
              className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Suggestion
            </button>
          </div>
        </div>
      )}

      {/* Birthday Detail Modal */}
      {selectedBirthday && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedBirthday(null)}
        >
          <div 
            className="w-full max-w-lg backdrop-blur-2xl bg-slate-900/95 border border-white/[0.15] rounded-[32px] p-10 shadow-[0_32px_128px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <button
                onClick={() => setSelectedBirthday(null)}
                className="ml-auto w-12 h-12 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo Section */}
            {selectedBirthday.image ? (
              <div className="mb-6 text-center">
                <div className="relative inline-block">
                  <img
                    src={selectedBirthday.image}
                    alt={selectedBirthday.fullName}
                    className="w-40 h-40 object-cover rounded-3xl border-2 border-pink-500/30 shadow-xl"
                  />
                  <a
                    href={selectedBirthday.image}
                    download={`${selectedBirthday.fullName.replace(/\s+/g, '_')}_photo.jpg`}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full text-white text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Save Photo
                  </a>
                </div>
              </div>
            ) : (
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-3xl flex items-center justify-center border border-white/[0.1]">
                  <svg className="w-12 h-12 text-pink-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-white/30 text-sm mt-3">No photo uploaded</p>
              </div>
            )}

            <h2 className="text-3xl font-black text-white mb-2 text-center">{selectedBirthday.fullName}</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/[0.05] rounded-2xl border border-white/[0.08]">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Date of Birth</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedBirthday.dateOfBirth).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.05] rounded-2xl border border-white/[0.08]">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Phone Number</p>
                  <p className="text-white font-semibold">{selectedBirthday.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.05] rounded-2xl border border-white/[0.08]">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Email Address</p>
                  <p className="text-white font-semibold">{selectedBirthday.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/[0.05] rounded-2xl border border-white/[0.08]">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Registered On</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedBirthday.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => deleteBirthday(selectedBirthday.id)}
              className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Birthday Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
