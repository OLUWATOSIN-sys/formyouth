"use client";

import { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  name: string;
  email: string;
  category: string;
  suggestion: string;
  anonymous: boolean;
  createdAt: string;
  status: "new" | "reviewed" | "implemented";
}

const categoryColors: Record<string, string> = {
  general: "from-blue-500 to-cyan-500",
  events: "from-pink-500 to-rose-500",
  programs: "from-green-500 to-emerald-500",
  improvement: "from-orange-500 to-amber-500",
};

const categoryIcons: Record<string, string> = {
  general: "💡",
  events: "🎉",
  programs: "📚",
  improvement: "🚀",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  reviewed: "bg-yellow-500",
  implemented: "bg-green-500",
};

export default function AdminPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchSuggestions();
    }
  }, [authenticated]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
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
    return s.status === filter || s.category === filter;
  });

  const stats = {
    total: suggestions.length,
    new: suggestions.filter((s) => s.status === "new").length,
    reviewed: suggestions.filter((s) => s.status === "reviewed").length,
    implemented: suggestions.filter((s) => s.status === "implemented").length,
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
              <p className="text-white/60">Enter password to view suggestions</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Suggestions Dashboard</h1>
                  <p className="text-white/60 text-sm">Heavens Gate Youth</p>
                </div>
              </div>
              <a href="/" className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
                ← Back to Site
              </a>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total", value: stats.total, color: "from-purple-500 to-pink-500", icon: "📊" },
              { label: "New", value: stats.new, color: "from-blue-500 to-cyan-500", icon: "🆕" },
              { label: "Reviewed", value: stats.reviewed, color: "from-yellow-500 to-orange-500", icon: "👀" },
              { label: "Implemented", value: stats.implemented, color: "from-green-500 to-emerald-500", icon: "✅" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-white/60 text-sm">{stat.label} Suggestions</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "new", "reviewed", "implemented", "general", "events", "programs", "improvement"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === f
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Suggestions Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-white/60 text-xl">No suggestions yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuggestions.map((suggestion, i) => (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestion(suggestion)}
                  className="suggestion-card backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColors[suggestion.category]} flex items-center justify-center text-2xl`}>
                      {categoryIcons[suggestion.category]}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[suggestion.status]}`}>
                      {suggestion.status}
                    </div>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    {suggestion.anonymous && <span className="text-purple-400">🕵️</span>}
                    {suggestion.name}
                  </h3>
                  
                  <p className="text-white/60 text-sm line-clamp-3 mb-4">
                    {suggestion.suggestion}
                  </p>
                  
                  <p className="text-white/40 text-xs">
                    {new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl backdrop-blur-xl bg-slate-900/90 border border-white/20 rounded-3xl p-8 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${categoryColors[selectedSuggestion.category]} flex items-center justify-center text-3xl`}>
                {categoryIcons[selectedSuggestion.category]}
              </div>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-white">{selectedSuggestion.name}</h2>
                {selectedSuggestion.anonymous && <span className="text-purple-400">🕵️ Anonymous</span>}
              </div>
              {selectedSuggestion.email && (
                <p className="text-white/60">{selectedSuggestion.email}</p>
              )}
              <p className="text-white/40 text-sm mt-1">
                {new Date(selectedSuggestion.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-purple-300 text-sm font-medium mb-2">Category</p>
              <span className={`inline-block px-4 py-2 rounded-xl bg-gradient-to-r ${categoryColors[selectedSuggestion.category]} text-white font-medium`}>
                {categoryIcons[selectedSuggestion.category]} {selectedSuggestion.category.charAt(0).toUpperCase() + selectedSuggestion.category.slice(1)}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-purple-300 text-sm font-medium mb-2">Suggestion</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white whitespace-pre-wrap">{selectedSuggestion.suggestion}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-purple-300 text-sm font-medium mb-3">Update Status</p>
              <div className="flex gap-2">
                {(["new", "reviewed", "implemented"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedSuggestion.id, status)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedSuggestion.status === status
                        ? `${statusColors[status]} text-white`
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => deleteSuggestion(selectedSuggestion.id)}
              className="w-full py-3 bg-red-500/20 border border-red-500/50 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-all"
            >
              🗑️ Delete Suggestion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
