"use client";

import { useState, useEffect } from "react";
import { Anton } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400" });

interface Attendee {
  _id: string;
  fullName: string;
  gender: string;
  parish: string;
  signedIn: boolean;
  signInTime: string | null;
  signOutTime: string | null;
}

interface Settings {
  signInEnabled: boolean;
  signInDeadline: string | null;
  signOutEnabled: boolean;
}

export default function CampMeetingPage() {
  const [activeTab, setActiveTab] = useState<"signin" | "signout">("signin");
  const [searchName, setSearchName] = useState("");
  const [foundAttendee, setFoundAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [successTime, setSuccessTime] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    document.title = "Cave of Adullam 2026 - Camp Meeting";
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/camp-meeting/settings");
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const formatSATime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-ZA", {
      timeZone: "Africa/Johannesburg",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    setLoading(true);
    setError(null);
    setFoundAttendee(null);

    try {
      const response = await fetch(`/api/camp-meeting?action=findAttendee&fullName=${encodeURIComponent(searchName)}`);
      const data = await response.json();
      if (response.ok) {
        setFoundAttendee(data);
      } else {
        setError(data.message || "Could not find your registration.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!foundAttendee) return;
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/camp-meeting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "selfSignIn", attendeeId: foundAttendee._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessTime(formatSATime(data.signInTime));
        setSuccess(`Welcome ${foundAttendee.fullName}! You are now signed in.`);
        setFoundAttendee(null);
        setSearchName("");
      } else {
        if (data.error === "already_signed_in") {
          setError(`You are already signed in since ${formatSATime(data.signInTime)}`);
        } else {
          setError(data.message || "Could not sign in.");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!foundAttendee) return;
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/camp-meeting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "selfSignOut", attendeeId: foundAttendee._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessTime(formatSATime(data.signOutTime));
        setSuccess(`Goodbye ${foundAttendee.fullName}! You have signed out.`);
        setFoundAttendee(null);
        setSearchName("");
      } else {
        setError(data.message || "Could not sign out.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error.");
    } finally {
      setActionLoading(false);
    }
  };

  const switchTab = (tab: "signin" | "signout") => {
    setActiveTab(tab);
    setSearchName("");
    setFoundAttendee(null);
    setError(null);
    setSuccess(null);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundImage: "url('/camp-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-orange-900/50 to-yellow-900/60" />
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <div className="mb-8">
            <div className={`w-32 h-32 mx-auto ${activeTab === "signin" ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-amber-400 to-orange-500"} rounded-full flex items-center justify-center shadow-2xl`}>
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-white ${anton.className}`}>
            {activeTab === "signin" ? "Welcome!" : "Goodbye!"}
          </h1>
          <p className={`text-2xl text-amber-200 mb-4 ${anton.className}`}>CAVE OF ADULLAM 2026</p>
          <p className="text-xl text-white/90 mb-6">{success}</p>
          {successTime && <p className="text-amber-300 mb-6 text-lg">{activeTab === "signin" ? "Signed in" : "Signed out"}: {successTime}</p>}
          <button onClick={() => { setSuccess(null); setSuccessTime(null); }} className={`px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-transform ${anton.className}`}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: "url('/camp-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-orange-900/50 to-yellow-900/60" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="-mb-4 md:-mb-20">
            <img src="/camp-logo.png" alt="Camp Logo" className="w-full max-w-[90vw] md:max-w-4xl mx-auto h-auto drop-shadow-2xl" />
          </div>
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500/30 to-red-500/30 backdrop-blur-xl rounded-2xl border border-amber-400/30 mb-3">
            <p className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 ${anton.className}`}>
              CAVE OF ADULLAM
            </p>
            <p className="text-xl text-white/90 mt-2">Theme: &quot;As He Prayed&quot; - Luke 9:29</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="backdrop-blur-2xl bg-white/10 border-2 border-amber-400/30 rounded-3xl p-6 md:p-10">
            <div className="flex mb-6 bg-white/10 rounded-2xl p-1">
              <button onClick={() => switchTab("signin")} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === "signin" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "text-white/60"} ${anton.className}`}>
                Sign In
              </button>
              <button onClick={() => switchTab("signout")} className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === "signout" ? "bg-gradient-to-r from-red-500 to-rose-600 text-white" : "text-white/60"} ${anton.className}`}>
                Sign Out
              </button>
            </div>

            {activeTab === "signout" && settings && !settings.signOutEnabled && (
              <div className="p-6 bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl text-center mb-6">
                <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className={`text-2xl font-bold text-amber-400 mb-2 ${anton.className}`}>Sign-Out Not Available</h3>
                <p className="text-white/70">Please wait for admin to enable sign-out.</p>
              </div>
            )}

            {(activeTab === "signin" || (activeTab === "signout" && settings?.signOutEnabled)) && (
              <>
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl mb-6 text-center">
                    <p className="text-red-300 font-bold">{error}</p>
                    <button onClick={() => setError(null)} className="text-red-400 text-sm mt-2 underline">Dismiss</button>
                  </div>
                )}

                <form onSubmit={handleSearch} className="mb-6">
                  <label className="block text-amber-300 font-bold mb-3 text-lg">Enter Your Name</label>
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Type your full name..."
                    className="w-full px-6 py-4 bg-white/10 border-2 border-amber-400/30 rounded-xl text-white text-lg placeholder-white/40 focus:border-amber-400 focus:outline-none mb-4"
                  />
                  <button type="submit" disabled={loading || !searchName.trim()} className={`w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl rounded-xl disabled:opacity-50 ${anton.className}`}>
                    {loading ? "Searching..." : "Find Me"}
                  </button>
                </form>

                {foundAttendee && (
                  <div className="p-6 bg-white/10 border-2 border-green-400/50 rounded-2xl">
                    <div className="text-center mb-4">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${foundAttendee.gender === "Male" ? "bg-blue-500/30" : "bg-pink-500/30"}`}>
                        <svg className={`w-8 h-8 ${foundAttendee.gender === "Male" ? "text-blue-400" : "text-pink-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className={`text-2xl font-bold text-white ${anton.className}`}>{foundAttendee.fullName}</h3>
                      <p className="text-white/60">{foundAttendee.parish} • {foundAttendee.gender}</p>
                      {foundAttendee.signedIn && foundAttendee.signInTime && (
                        <p className="text-green-400 mt-2">Signed in: {formatSATime(foundAttendee.signInTime)}</p>
                      )}
                      {!foundAttendee.signedIn && <p className="text-amber-400 mt-2">Not yet signed in</p>}
                    </div>

                    {activeTab === "signin" ? (
                      <button onClick={handleSignIn} disabled={actionLoading || foundAttendee.signedIn} className={`w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-xl disabled:opacity-50 ${anton.className}`}>
                        {actionLoading ? "Signing In..." : foundAttendee.signedIn ? "Already Signed In" : "Confirm Sign In"}
                      </button>
                    ) : (
                      <button onClick={handleSignOut} disabled={actionLoading || !foundAttendee.signedIn} className={`w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-xl rounded-xl disabled:opacity-50 ${anton.className}`}>
                        {actionLoading ? "Signing Out..." : !foundAttendee.signedIn ? "Not Signed In" : "Confirm Sign Out"}
                      </button>
                    )}

                    <button onClick={() => { setFoundAttendee(null); setSearchName(""); }} className="w-full mt-3 py-2 text-white/60 hover:text-white">
                      Search Again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
