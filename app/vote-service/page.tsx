"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Nominee {
  name: string;
  image?: string;
}

const imageMapping: Record<string, string> = {
  "Sis Wuraola": "/nominees/Wuraola Afolabi.png",
  "Sis Sharon Alika": "/nominees/Sharon Alika.png",
  "Bro Irey": "/nominees/Ireoluwa Aboyewa.png",
  "Sis Nobuhle": "/nominees/Nobuhle Nukeri.png",
  "Sis Esther Joshua": "/nominees/Esther Joshua.png",
  "Bro Femi": "/nominees/Bro Femi .png",
};

const getImagePath = (name: string) => {
  return imageMapping[name] || "/nominees/placeholder.jpg";
};

const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
  }
  const canvasFingerprint = canvas.toDataURL();
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform,
    canvasFingerprint.slice(0, 100)
  ].join('|');
  
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const category = {
  id: "hand_of_service",
  title: "Hand of Service",
  nominees: [
    { name: "Sis Wuraola" },
    { name: "Sis Sharon Alika" },
    { name: "Bro Irey" },
    { name: "Sis Nobuhle" },
    { name: "Sis Esther Joshua" },
    { name: "Bro Femi" }
  ]
};

export default function VoteServicePage() {
  const [selectedNominee, setSelectedNominee] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    const fingerprint = generateDeviceFingerprint();
    setDeviceId(fingerprint);
    
    const hasVoted = localStorage.getItem("hasVoted_hand_of_service");
    if (hasVoted === "true") {
      setAlreadyVoted(true);
    }
    
    const savedVote = localStorage.getItem("vote_hand_of_service");
    if (savedVote) {
      setSelectedNominee(savedVote);
    }
  }, []);

  const handleVoteChange = (nominee: string) => {
    setSelectedNominee(nominee);
    localStorage.setItem("vote_hand_of_service", nominee);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedNominee) {
      alert("Please select a nominee before submitting!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          votes: { [category.id]: selectedNominee }, 
          deviceId 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("hasVoted_hand_of_service", "true");
        localStorage.removeItem("vote_hand_of_service");
        setSubmitted(true);
      } else if (response.status === 429) {
        setAlreadyVoted(true);
      } else {
        alert(data.error || "Failed to submit vote. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (alreadyVoted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-12 shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">Already Voted</h1>
              <p className="text-gray-300 text-lg">
                You have already voted in this category 😉
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-12 shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">Thank You!</h1>
              <p className="text-gray-300 text-lg">
                Your vote has been submitted successfully.
              </p>
            </div>
          </div>
        </div>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#D4AF37]">
              VOTE
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.nominees.map((nominee) => (
                  <label 
                    key={nominee.name}
                    className={`relative flex items-center p-4 rounded-lg cursor-pointer transition-all group ${
                      selectedNominee === nominee.name
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-opacity-20 border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-gray-800 bg-opacity-50 border-2 border-gray-700 hover:border-[#D4AF37] hover:shadow-md hover:shadow-[#D4AF37]/10'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={category.id}
                        value={nominee.name}
                        checked={selectedNominee === nominee.name}
                        onChange={() => handleVoteChange(nominee.name)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedNominee === nominee.name
                          ? 'border-[#D4AF37] bg-[#D4AF37]'
                          : 'border-gray-500 bg-transparent group-hover:border-[#D4AF37]'
                      }`}>
                        {selectedNominee === nominee.name && (
                          <div className="w-3 h-3 rounded-full bg-black"></div>
                        )}
                      </div>
                    </div>
                    
                    <div 
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage({ 
                          src: nominee.image || getImagePath(nominee.name), 
                          name: nominee.name 
                        });
                      }}
                      className={`ml-4 relative w-20 h-20 rounded-full overflow-hidden border-4 transition-all shadow-xl cursor-pointer hover:scale-110 ${
                        selectedNominee === nominee.name
                          ? 'border-[#FFD700] ring-4 ring-[#D4AF37] ring-opacity-50'
                          : 'border-gray-600 group-hover:border-[#D4AF37]'
                      }`}
                    >
                      <Image
                        src={nominee.image || getImagePath(nominee.name)}
                        alt={nominee.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/nominees/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <span className={`ml-4 text-lg font-medium transition-colors ${
                      selectedNominee === nominee.name
                        ? 'text-black'
                        : 'text-white group-hover:text-[#D4AF37]'
                    }`}>{nominee.name}</span>
                    {selectedNominee === nominee.name && (
                      <svg className="w-5 h-5 text-[#FFD700] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#D4AF37] text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-[#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Vote"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl w-full animate-spin-in">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#D4AF37] shadow-2xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/nominees/placeholder.jpg';
                }}
              />
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-[#D4AF37]">{selectedImage.name}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
