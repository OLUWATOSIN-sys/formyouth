'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    parish: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as { id?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Registration failed');
      router.push(`/ticket/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '10px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        position: 'relative',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(40,0,80,0.93) 0%, rgba(100,0,50,0.89) 50%, rgba(10,0,30,0.96) 100%)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
        {/* Logos */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Image
            src="/icon1.png"
            alt="RCCG YAYA SA2"
            width={340}
            height={65}
            style={{ objectFit: 'contain', filter: 'brightness(1.15)', height: 'auto' }}
            priority
          />
        </div>

        {/* Event branding */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <p
            style={{
              color: '#FFD700',
              fontSize: '11px',
              letterSpacing: '4px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            RCCG YAYA SA2
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px' }}>
            <span style={{ color: 'white', fontSize: '42px', fontWeight: 900, letterSpacing: '-1px' }}>
              IDENTITY
            </span>
            <span style={{ color: '#FFD700', fontSize: '52px', fontWeight: 900 }}>2026</span>
          </div>
        </div>

        {/* TRANSFIGURED banner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Image
            src="/icon2.png"
            alt="Theme: TRANSFIGURED"
            width={480}
            height={96}
            style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '80px' }}
            priority
          />
        </div>

        {/* Event details pill */}
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '20px',
          }}
        >
          <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Calendar size={13} style={{ flexShrink: 0 }} />
            Thursday, June 16, 2026
            <span style={{ opacity: 0.4 }}>·</span>
            <Clock size={13} style={{ flexShrink: 0 }} />
            9:00 AM
          </p>
          <p style={{ color: '#d1d5db', fontSize: '11px', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            Friend of God Campus · Cape Town, ZA
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px',
            padding: '28px 24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          <h2
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: '17px',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            Data to Registration, Please
          </h2>
          <p
            style={{
              color: '#9ca3af',
              textAlign: 'center',
              fontSize: '12px',
              marginBottom: '20px',
            }}
          >
            Fill in your details to receive your event ticket
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#FFD700',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Full Name <span style={{ color: '#f87171' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange('fullName')}
                placeholder="Enter your full name"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: '#FFD700',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: '#FFD700',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+27 XX XXX XXXX"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: '#FFD700',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Parish / Church
              </label>
              <input
                type="text"
                value={formData.parish}
                onChange={handleChange('parish')}
                placeholder="Your RCCG Parish name"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,215,0,0.6)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
              />
            </div>

            {error && (
              <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: loading
                  ? 'rgba(255,215,0,0.35)'
                  : 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                color: '#1a0800',
                fontSize: '14px',
                fontWeight: 800,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(255,140,0,0.4)',
                transition: 'all 0.2s',
                marginTop: '4px',
              }}
            >
              {loading ? 'Registering...' : 'Register & Get Ticket →'}
            </button>
          </form>
        </div>

        <p
          style={{
            color: '#6b7280',
            textAlign: 'center',
            fontSize: '11px',
            marginTop: '16px',
          }}
        >
          Friend of God Campus · Cape Town, WC · June 16, 2026
        </p>
      </div>
    </div>
  );
}
