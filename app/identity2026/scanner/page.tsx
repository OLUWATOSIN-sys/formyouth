'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle2, XCircle, Mail, Phone, Building2, QrCode, ArrowLeft, Check } from 'lucide-react';

const Scanner = dynamic(() => import('@/components/BarcodeScanner'), { ssr: false });

const SCAN_PASSWORD = 'admin2026';

interface Reg {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parish: string;
  createdAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

const CSS = `
  .scan-wrap {
    min-height: 100vh;
    background: linear-gradient(135deg,#0d001f 0%,#280050 50%,#0a001a 100%);
    padding: 16px 12px 72px;
  }
  .scan-inner { max-width: 960px; margin: 0 auto; }

  /* ── Top bar ── */
  .scan-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 10px;
  }
  .scan-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .scan-logo { height: 34px; object-fit: contain; }
  .scan-title { color: white; font-size: 17px; font-weight: 900; display: flex; align-items: center; gap: 6px; }
  .scan-sub { color: #6b7280; font-size: 11px; margin-top: 1px; }
  .scan-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 10px;
    color: #9ca3af;
    padding: 10px 14px;
    font-size: 13px;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Grid ── */
  .scan-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;
  }

  /* ── Panels ── */
  .scan-panel {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(14px);
    border-radius: 18px;
    padding: 18px;
    border: 1px solid rgba(255,255,255,0.10);
  }
  .scan-panel-label {
    color: #FFD700;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  /* Camera wrapper — fixed aspect ratio */
  .scan-camera-wrap {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
  }
  .scan-hint { color: #4b5563; font-size: 11px; text-align: center; margin-top: 10px; }

  /* Result panel idle */
  .scan-idle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 44px 20px;
    opacity: 0.4;
  }
  .scan-idle p { color: #9ca3af; font-size: 13px; text-align: center; }

  /* Result card */
  .scan-avatar-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding: 14px;
    border-radius: 13px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .scan-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 900;
    font-size: 20px;
    flex-shrink: 0;
  }
  .scan-name { color: white; font-weight: 800; font-size: 16px; }
  .scan-id { color: #6b7280; font-size: 10px; font-family: monospace; margin-top: 2px; }
  .scan-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(74,222,128,0.15);
    color: #4ade80;
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .scan-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
  .scan-detail-row { display: flex; align-items: center; gap: 10px; color: #d1d5db; font-size: 13px; }

  /* Buttons */
  .scan-btn-signin {
    width: 100%;
    padding: 18px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg,#4ade80 0%,#22c55e 100%);
    color: #052e16;
    font-size: 17px;
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 1px;
    box-shadow: 0 8px 24px rgba(74,222,128,0.35);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .scan-btn-signin:disabled {
    background: rgba(74,222,128,0.35);
    box-shadow: none;
    cursor: not-allowed;
  }
  .scan-btn-next {
    width: 100%;
    background: none;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    color: #6b7280;
    padding: 13px;
    font-size: 13px;
    cursor: pointer;
  }
  .scan-checkedin-box {
    background: rgba(74,222,128,0.10);
    border: 1px solid rgba(74,222,128,0.3);
    border-radius: 14px;
    padding: 18px;
    text-align: center;
    margin-bottom: 12px;
  }
  .scan-err-box {
    background: rgba(248,113,113,0.10);
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 14px;
    padding: 18px;
  }
  .scan-btn-again {
    margin-top: 12px;
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    color: #9ca3af;
    padding: 10px 16px;
    font-size: 13px;
    cursor: pointer;
  }

  /* ── MOBILE: stack vertically ── */
  @media (max-width: 640px) {
    .scan-wrap { padding: 12px 10px 80px; }
    .scan-grid { grid-template-columns: 1fr; }
    .scan-title { font-size: 15px; }
    .scan-logo { height: 28px; }
    .scan-back { padding: 8px 12px; font-size: 12px; }
    .scan-panel { padding: 14px; border-radius: 16px; }
    .scan-btn-signin { font-size: 16px; padding: 16px; }
    .scan-btn-next { padding: 12px; }
    .scan-btn-again { width: 100%; }
  }

  @keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
`;

export default function ScanPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');

  const [result, setResult] = useState<Reg | null>(null);
  const [scanErr, setScanErr] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [signedStatus, setSignedStatus] = useState<'done' | 'already' | 'error' | null>(null);
  const [lastId, setLastId] = useState('');

  const login = () => {
    if (pw === SCAN_PASSWORD) { setAuthed(true); setPwErr(''); }
    else setPwErr('Incorrect password.');
  };

  const onScan = useCallback(async (text: string) => {
    const raw = text.trim();
    const id = raw.includes('/ticket/') ? (raw.split('/ticket/').pop() ?? raw) : raw;
    if (id === lastId) return;
    setLastId(id);
    setScanErr('');
    setSignedStatus(null);
    setResult(null);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(id)}`);
      if (!res.ok) { setScanErr(`No registration found for: ${id}`); return; }
      setResult((await res.json()) as Reg);
    } catch {
      setScanErr('Network error — please try again.');
    }
  }, [lastId]);

  const signIn = async () => {
    if (!result) return;
    setSigningIn(true);
    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(result.id)}`, { method: 'POST' });
      const data = (await res.json()) as { error?: string; registration?: Reg };
      if (res.status === 409) {
        setSignedStatus('already');
        setResult(prev => prev ? { ...prev, checkedIn: true } : prev);
      } else if (res.ok && data.registration) {
        setResult(data.registration);
        setSignedStatus('done');
      } else {
        setSignedStatus('error');
      }
    } catch {
      setSignedStatus('error');
    } finally {
      setSigningIn(false);
    }
  };

  const reset = () => {
    setResult(null);
    setScanErr('');
    setSignedStatus(null);
    setLastId('');
  };

  /* ── LOGIN ── */
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a003a 0%,#3d0060 60%,#0a001a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <style>{CSS}</style>
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', borderRadius: '22px', padding: '38px 28px', width: '100%', maxWidth: '380px', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon1.png" alt="RCCG" style={{ height: '50px', objectFit: 'contain', marginBottom: '14px' }} />
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 900, marginBottom: '4px' }}>Check-In</h1>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>IDENTITY 2026 · RCCG YAYA SA2</p>
          </div>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter access password" autoFocus
            style={{ width: '100%', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '15px 16px', color: 'white', fontSize: '16px', outline: 'none', marginBottom: '10px', WebkitAppearance: 'none' }}
            onKeyDown={e => { if (e.key === 'Enter') login(); }} />
          {pwErr && <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>{pwErr}</p>}
          <button onClick={login} style={{ width: '100%', padding: '16px', borderRadius: '13px', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: 'white', fontSize: '16px', fontWeight: 900, cursor: 'pointer', letterSpacing: '1px' }}>
            Check-In →
          </button>
        </div>
      </div>
    );
  }

  /* ── SCANNER ── */
  return (
    <div className="scan-wrap">
      <style>{CSS}</style>
      <div className="scan-inner">

        {/* Top bar */}
        <div className="scan-topbar">
          <div className="scan-title-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon1.png" alt="RCCG" className="scan-logo" />
            <div>
              <h1 className="scan-title"><QrCode size={15} /> Check-In</h1>
              <p className="scan-sub">IDENTITY 2026 · RCCG YAYA SA2</p>
            </div>
          </div>
          <a href="/admin1" className="scan-back"><ArrowLeft size={13} /> Admin</a>
        </div>

        {/* Main grid — stacks to 1 col on mobile */}
        <div className="scan-grid">

          {/* Camera panel */}
          <div className="scan-panel">
            <p className="scan-panel-label">Check-In Anywhere</p>
            <div className="scan-camera-wrap">
              <Scanner onScan={onScan as (text: string) => void} />
            </div>
            <p className="scan-hint">Hold the attendee&apos;s QR code within the frame</p>
          </div>

          {/* Result panel */}
          <div className="scan-panel">
            <p className="scan-panel-label">Scan Result</p>

            {!result && !scanErr && (
              <div className="scan-idle">
                <QrCode size={42} color="white" />
                <p>Waiting for QR scan…</p>
              </div>
            )}

            {scanErr && (
              <div className="scan-err-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <XCircle size={18} color="#f87171" />
                  <p style={{ color: '#f87171', fontWeight: 700, fontSize: '15px' }}>Not Found</p>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '13px' }}>{scanErr}</p>
                <button className="scan-btn-again" onClick={reset}>Scan Again</button>
              </div>
            )}

            {result && (
              <div style={{ animation: 'slideIn 0.2s ease-out' }}>

                {/* Avatar + name */}
                <div className="scan-avatar-row" style={{ background: result.checkedIn ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.06)', borderColor: result.checkedIn ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="scan-avatar" style={{ background: result.checkedIn ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                    {result.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="scan-name">{result.fullName}</p>
                    <p className="scan-id">{result.id}</p>
                  </div>
                  {result.checkedIn && (
                    <span className="scan-badge"><Check size={10} /> In</span>
                  )}
                </div>

                {/* Details */}
                <div className="scan-details">
                  {result.email && <div className="scan-detail-row"><Mail size={13} color="#9ca3af" />{result.email}</div>}
                  {result.phone && <div className="scan-detail-row"><Phone size={13} color="#9ca3af" />{result.phone}</div>}
                  {result.parish && <div className="scan-detail-row"><Building2 size={13} color="#9ca3af" />{result.parish}</div>}
                </div>

                {/* Already checked in */}
                {result.checkedIn && (
                  <div className="scan-checkedin-box">
                    <CheckCircle2 size={32} color="#4ade80" style={{ marginBottom: '8px' }} />
                    <p style={{ color: '#4ade80', fontWeight: 800, fontSize: '17px' }}>
                      {signedStatus === 'already' ? 'Already Checked In' : 'Checked In!'}
                    </p>
                    {result.checkedInAt && (
                      <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                        at {new Date(result.checkedInAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    )}
                  </div>
                )}

                {/* Sign in button */}
                {!result.checkedIn && (
                  <button className="scan-btn-signin" onClick={() => void signIn()} disabled={signingIn}>
                    {signingIn ? 'Signing in…' : <><CheckCircle2 size={18} /> SIGN IN ATTENDEE</>}
                  </button>
                )}

                <button className="scan-btn-next" onClick={reset}>Scan Next</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
