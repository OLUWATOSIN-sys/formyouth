"use client";

import { useEffect } from "react";

export default function VotingRedirect() {
  useEffect(() => {
    // Redirect to voting-part1
    window.location.href = "/voting-part1";
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#D4AF37] text-2xl">Redirecting to voting page...</div>
    </div>
  );
}