"use client";

import { useState, useEffect } from "react";

interface CategoryResults {
  [nominee: string]: number;
}

interface Results {
  [category: string]: CategoryResults;
}

interface HighestVoted {
  [category: string]: {
    nominee: string;
    votes: number;
  };
}

const categoryNames: Record<string, string> = {
  lifetime_achievement: "Life Time Achievement Award",
  hand_of_service: "Hand of Service",
  most_committed: "Most Committed",
  most_supportive: "Most Supportive",
  most_outspoken: "Most Outspoken",
  reserved: "Reserved"
};

export default function ResultsPage() {
  const [results, setResults] = useState<Results>({});
  const [highestVoted, setHighestVoted] = useState<HighestVoted>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/votes", {
        cache: 'no-store'
      });
      const data = await response.json();
      setResults(data.results || {});
      setHighestVoted(data.highestVoted || {});
      setTotalVotes(data.totalVotes || 0);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllVotes = async () => {
    const confirmed = confirm("Are you sure you want to clear all votes? This action cannot be undone!");
    if (!confirmed) return;

    setClearing(true);
    try {
      const response = await fetch("/api/votes/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("All votes have been cleared successfully!");
        fetchResults();
      } else {
        alert("Failed to clear votes. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing votes:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchResults, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#D4AF37] text-2xl">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/background.png)',
          opacity: 0.2,
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4">
              Voting Results
            </h1>
            <p className="text-gray-300 text-lg mb-4">
              SERVICE & COMMUNITY AWARDS
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-gray-800 px-6 py-3 rounded-lg">
                <span className="text-gray-400">Total Votes: </span>
                <span className="text-[#D4AF37] font-bold text-xl">{totalVotes}</span>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  autoRefresh 
                    ? 'bg-[#D4AF37] text-black hover:bg-[#FFD700]' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {autoRefresh ? '✓ Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={fetchResults}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Now
              </button>
              <button
                onClick={clearAllVotes}
                disabled={clearing}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {clearing ? "Clearing..." : "Clear All Votes"}
              </button>
            </div>
          </div>

          {/* Results by Category */}
          <div className="space-y-8">
            {Object.keys(categoryNames).map((categoryId, idx) => {
              const categoryResults = results[categoryId] || {};
              const nominees = Object.keys(categoryResults);
              const maxVotes = Math.max(...Object.values(categoryResults), 0);
              const winner = highestVoted[categoryId];

              return (
                <div 
                  key={categoryId}
                  className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#D4AF37]">
                      {idx + 1}. {categoryNames[categoryId]}
                    </h2>
                    {winner && winner.votes > 0 && (
                      <div className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-bold text-sm">
                        🏆 Leading: {winner.nominee} ({winner.votes})
                      </div>
                    )}
                  </div>

                  {nominees.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No votes yet</p>
                  ) : (
                    <div className="space-y-4">
                      {nominees
                        .sort((a, b) => categoryResults[b] - categoryResults[a])
                        .map((nominee) => {
                          const voteCount = categoryResults[nominee];
                          const percentage = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;
                          const isWinner = winner && winner.nominee === nominee;

                          return (
                            <div key={nominee} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`font-semibold ${isWinner ? 'text-[#FFD700]' : 'text-white'}`}>
                                  {isWinner && '👑 '}{nominee}
                                </span>
                                <span className="text-[#D4AF37] font-bold">
                                  {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                                </span>
                              </div>
                              <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                                <div 
                                  className={`absolute inset-y-0 left-0 rounded-lg transition-all duration-500 ${
                                    isWinner 
                                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]' 
                                      : 'bg-gradient-to-r from-gray-600 to-gray-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                                    <span className="text-xs font-bold text-white">
                                      {percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
