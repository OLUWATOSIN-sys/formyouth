'use client';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import type { Registration } from '@/lib/db';
import { CheckCircle2, Printer, ArrowLeft, Mail, Phone, Building2, Calendar } from 'lucide-react';

export default function TicketView({ registration }: { registration: Registration }) {
  const [qrValue, setQrValue] = useState(`/ticket/${registration.id}`);
  useEffect(() => { setQrValue(window.location.href); }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '32px 16px 48px',
        position: 'relative',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(30,0,60,0.93) 0%, rgba(80,0,40,0.89) 60%, rgba(10,0,25,0.96) 100%)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '920px' }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }} className="no-print">
          <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} />
            Registration Successful!
          </p>
          <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 800, marginBottom: '4px' }}>
            Your Event Ticket
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            Present this at the entrance — printed or on your phone
          </p>
        </div>

        {/* ─── TICKET ─── */}
        <div
          className="ticket-print-wrapper"
          style={{ overflowX: 'auto', paddingBottom: '4px' }}
        >
          <div
            style={{
              display: 'flex',
              borderRadius: '18px',
              overflow: 'hidden',
              height: '285px',
              minWidth: '700px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* ── Main body ── */}
            <div
              style={{
                flex: '0 0 68%',
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'url(/bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
              }}
            >
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(65,0,105,0.90) 0%, rgba(135,0,65,0.82) 45%, rgba(185,75,5,0.74) 100%)',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px 20px',
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    flexShrink: 0,
                  }}
                >
                  {/* Logos */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icon1.png"
                    alt="RCCG"
                    style={{ height: '40px', objectFit: 'contain', flexShrink: 0 }}
                  />

                  {/* Name */}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: '9px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      NAME
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '16px',
                        letterSpacing: '0.5px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    >
                      {registration.fullName}
                    </div>
                  </div>

                  {/* Identity 2026 */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        color: '#FFD700',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      YAYA SA 2
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '19px',
                        fontWeight: 900,
                        letterSpacing: '3px',
                        lineHeight: 1.1,
                      }}
                    >
                      IDENTITY
                    </div>
                    <div
                      style={{
                        color: '#FFD700',
                        fontSize: '28px',
                        fontWeight: 900,
                        lineHeight: 1,
                        textShadow: '0 0 20px rgba(255,215,0,0.4)',
                      }}
                    >
                      2026
                    </div>
                  </div>
                </div>

                {/* Center — TRANSFIGURED image */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    margin: '4px 0',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icon2.png"
                    alt="TRANSFIGURED"
                    style={{
                      width: '100%',
                      maxHeight: '145px',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Bottom row — date/time */}
                <div
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  <span style={{ fontSize: '10px', letterSpacing: '3px', opacity: 0.75 }}>
                    DATE:{' '}
                  </span>
                  <span style={{ fontSize: '26px', fontWeight: 900 }}>JUNE 16</span>
                  <span
                    style={{ fontSize: '22px', fontWeight: 200, margin: '0 10px', opacity: 0.5 }}
                  >
                    |
                  </span>
                  <span style={{ fontSize: '10px', letterSpacing: '3px', opacity: 0.75 }}>
                    TIME:{' '}
                  </span>
                  <span style={{ fontSize: '26px', fontWeight: 900 }}>9AM</span>
                </div>
              </div>
            </div>

            {/* ── Stub / right section ── */}
            <div
              style={{
                flex: '0 0 32%',
                background:
                  'linear-gradient(180deg, #3b0070 0%, #7c3aed 35%, #c026d3 65%, #db2777 100%)',
                borderLeft: '3px dashed rgba(255,255,255,0.30)',
                display: 'flex',
                alignItems: 'center',
                padding: '14px 12px',
                gap: '10px',
              }}
            >
              {/* Vertical text */}
              <div
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                TICKET ADMITS ONE
              </div>

              {/* QR code area */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '8px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <QRCode
                    value={qrValue}
                    size={140}
                    level="M"
                    style={{ width: '100%', height: 'auto', maxWidth: '140px' }}
                  />
                </div>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.60)',
                    fontSize: '8px',
                    marginTop: '6px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    letterSpacing: '1.5px',
                    wordBreak: 'break-all',
                  }}
                >
                  No. {registration.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '22px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
              color: '#1a0800',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '1px',
              boxShadow: '0 8px 24px rgba(255,140,0,0.35)',
            }}
          >
            <Printer size={14} style={{ marginRight: 6 }} />
            Print Ticket
          </button>
          <a
            href="/identity/identity2026"
            style={{
              background: 'rgba(255,255,255,0.09)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={14} style={{ marginRight: 6 }} />
            Register Another
          </a>
        </div>

      </div>
    </div>
  );
}
