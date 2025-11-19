"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function UploadPaymentPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [registrant, setRegistrant] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/validate-token/${token}`);
      const data = await response.json();
      
      if (data.valid) {
        setValid(true);
        setRegistrant(data.registrant);
        setUploaded(data.registrant.paymentStatus !== "not_paid");
      }
    } catch (error) {
      console.error("Error validating token:", error);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch("/api/upload-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: token,
            proofOfPayment: base64,
          }),
        });

        if (response.ok) {
          setUploaded(true);
        } else {
          alert("Failed to upload proof of payment");
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("An error occurred while uploading");
    }
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Validating link...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <Image
            src="/logo.png"
            alt="CCC Logo"
            width={100}
            height={100}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-red-500 mb-4">Invalid or Expired Link</h1>
          <p className="text-white/70 mb-4">
            This payment upload link is either invalid or has expired (24-hour limit).
          </p>
          <p className="text-white/70">
            Please contact the organizers for assistance.
          </p>
        </div>
      </div>
    );
  }

  if (uploaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center fade-in">
          <Image
            src="/logo.png"
            alt="CCC Logo"
            width={100}
            height={100}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold gold-shimmer mb-4">Upload Successful!</h1>
          <p className="text-xl text-white/90 mb-4">
            Your proof of payment has been received
          </p>
          <p className="text-[#D4AF37] mb-6">
            Our team will review and confirm your payment within 24-48 hours.
          </p>
          <div className="bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] p-6 rounded-lg">
            <p className="text-black font-bold text-lg mb-2">Youth Gala 2025</p>
            <p className="text-black">29th November 2025</p>
            <p className="text-black font-semibold">Theme: ROYALTY</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="CCC Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold gold-shimmer mb-2">
            Upload Proof of Payment
          </h1>
          <p className="text-white/70">Youth Gala 2025 - Registration</p>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Registration Details</h2>
          <div className="space-y-2 text-white/80">
            <p><span className="text-[#D4AF37]">Name:</span> {registrant?.name}</p>
            <p><span className="text-[#D4AF37]">Email:</span> {registrant?.email}</p>
            <p><span className="text-[#D4AF37]">Additional Guests:</span> {registrant?.guests}</p>
            <p><span className="text-[#D4AF37]">Total People:</span> {(parseInt(registrant?.guests || "0") + 1)} (including you)</p>
            <p><span className="text-[#D4AF37]">Ticket Type:</span> {registrant?.ticketType === "vip" ? "VIP" : registrant?.ticketType === "vip-plus" ? "VIP Plus-One" : "Regular"}</p>
            <p><span className="text-[#D4AF37]">Amount Due:</span> <span className="text-[#FFD700] font-bold text-xl">R{(registrant?.ticketType === "vip-plus" 
              ? 2000 
              : (parseInt(registrant?.guests || "0") + 1) * (registrant?.ticketType === "vip" ? 1500 : 500)
            ).toLocaleString()}</span></p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#D4AF37] rounded-xl p-8">
          <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Upload Payment Proof</h2>
          
          <div className="mb-6">
            <label className="block text-white/70 mb-2">
              Please upload a clear image of your payment receipt or bank transfer confirmation
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-3 bg-black/50 border-2 border-[#D4AF37]/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D4AF37] file:text-black file:font-semibold hover:file:bg-[#FFD700] transition-all"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <p className="text-white/70 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Payment proof preview"
                className="w-full max-h-96 object-contain border-2 border-[#D4AF37]/30 rounded-lg"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full py-4 px-8 bg-gradient-to-r from-[#B8941E] via-[#D4AF37] to-[#FFD700] text-black font-bold text-lg rounded-lg hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Submit Proof of Payment"
            )}
          </button>

          <p className="text-white/50 text-sm mt-4 text-center">
            ⚠️ Payment due by <span className="text-[#FFD700] font-semibold">November 20th, 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
}
