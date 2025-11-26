"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface VoteData {
  [category: string]: string;
}

const categories = [
  {
    id: "lifetime_achievement",
    title: "Life Time Achievement Award",
    nominees: [
      "Sis Nda",
      "Sis Nobuhle",
      "Bro Abbey Amosun",
      "Sis Maria Daniel",
      "Sis Natasha Mopalami",
      "Bro. Aaron Ozakpolor",
      "Sis Abiola Babajide"
    ]
  },
  {
    id: "hand_of_service",
    title: "Hand of Service",
    nominees: [
      "Sis Wuraola",
      "Sis Sharon Alika",
      "Bro Irey",
      "Sis Nobuhle",
      "Sis Esther Joshua",
      "Bro Femi"
    ]
  },
  {
    id: "most_committed",
    title: "Most Committed",
    nominees: [
      "Bro Irey",
      "Bro Abbey",
      "Sis Maria Daniel",
      "Sis. Esther Joshua",
      "Sis. Favour Joseph",
      "Sis Sharon Alika"
    ]
  },
  {
    id: "most_supportive",
    title: "Most Supportive",
    nominees: [
      "Sis Wuraola Afolabi",
      "Bro Abiodun Oladipupo",
      "Bro Joseph",
      "Sis Tolu Olaniran",
      "Sis. Elizabeth Joshua",
      "Sis Juanita Mununashe",
      "Bro Segun Olaniyan"
    ]
  },
  {
    id: "most_outspoken",
    title: "Most Outspoken",
    nominees: [
      "Sis Charne Booysen",
      "Bro Abbey Amosun",
      "Sis Buhle",
      "Bro Light",
      "Bro Endurance Ajayi"
    ]
  },
  {
    id: "reserved",
    title: "Reserved",
    nominees: [
      "Bro Noel Ozakpolor",
      "Bro Aaron Ozakpolor",
      "Sis Natasha Mopalami",
      "Bro Irey",
      "Sis Wuraola Afolabi",
      "Bro Endurance Ajayi"
    ]
  }
];

export default function VotingPage() {
  const [votes, setVotes] = useState<VoteData>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    // Check if user has already voted (permanent restriction)
    const hasVoted = localStorage.getItem("hasVoted");
    if (hasVoted === "true") {
      setAlreadyVoted(true);
    }
  }, []);

  const handleVoteChange = (categoryId: string, nominee: string) => {
    setVotes({
      ...votes,
      [categoryId]: nominee
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all categories are voted
    const allCategoriesVoted = categories.every(cat => votes[cat.id]);
    if (!allCategoriesVoted) {
      alert("Please vote in all categories before submitting!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ votes }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("hasVoted", "true");
        setSubmitted(true);
      } else if (response.status === 429) {
        setAlreadyVoted(true);
      } else {
        alert(data.error || "Failed to submit votes. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting votes:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (alreadyVoted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            opacity: 0.3,
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-4 py-12">
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
                  You have already submitted your votes from this device.
                </p>
                <p className="text-gray-400 mt-4">
                  Thank you for participating!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            opacity: 0.3,
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-4 py-12">
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
                  Your votes have been successfully submitted.
                </p>
              </div>
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
          opacity: 0.3,
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4">
              SERVICE & COMMUNITY AWARDS
            </h1>
            <p className="text-gray-300 text-lg">
              Vote for your favorites in each category
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {categories.map((category, idx) => (
              <div 
                key={category.id}
                className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-6 md:p-8 shadow-2xl"
              >
                <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
                  {idx + 1}. {category.title}
                </h2>
                <div className="space-y-3">
                  {category.nominees.map((nominee) => (
                    <label 
                      key={nominee}
                      className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                        votes[category.id] === nominee
                          ? 'bg-[#D4AF37] bg-opacity-20 border-2 border-[#D4AF37]'
                          : 'bg-gray-800 bg-opacity-50 border-2 border-transparent hover:border-[#D4AF37] hover:border-opacity-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={category.id}
                        value={nominee}
                        checked={votes[category.id] === nominee}
                        onChange={() => handleVoteChange(category.id, nominee)}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-2"
                      />
                      <span className="ml-3 text-white text-lg">{nominee}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#D4AF37] text-black px-12 py-4 rounded-lg text-xl font-bold hover:bg-[#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Votes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
