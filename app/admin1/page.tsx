'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Users, Check, RefreshCw, LogOut, Trash2, QrCode, Clock, Mail, Phone, Building2, Settings } from 'lucide-react';

const ADMIN_PASSWORD = 'admin2026';

interface Reg {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  parish: string;
  gender: string;
  age: string;
  createdAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${color}44`,
      borderRadius: '16px',
      padding: '18px 22px',
      flex: '1 1 120px',
    }}>
      <p style={{ color, fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>{value}</p>
      <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>{label}</p>
    </div>
  );
}

/* ─── main page ─── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [regs, setRegs] = useState<Reg[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<number | ''>('');
  const [savedCapacity, setSavedCapacity] = useState<number | null>(null);
  const [regCount, setRegCount] = useState(0);
  const [savingCap, setSavingCap] = useState(false);
  const [capMsg, setCapMsg] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const r = await fetch('/api/settings');
      const d = await r.json() as { limit: number | null; count: number };
      setSavedCapacity(d.limit);
      setRegCount(d.count);
      if (d.limit) setCapacity(d.limit);
    } catch { /* ignore */ }
  }, []);

  const saveCapacity = async () => {
    if (!capacity || Number(capacity) < 1) return;
    setSavingCap(true);
    setCapMsg('');
    try {
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit: Number(capacity) }) });
      setSavedCapacity(Number(capacity));
      setCapMsg('Saved!');
      setTimeout(() => setCapMsg(''), 2500);
    } catch { setCapMsg('Failed to save.'); }
    finally { setSavingCap(false); }
  };

  const fetchRegs = useCallback(async () => {
    setLoadingList(true);
    try {
      const r = await fetch('/api/registrations');
      setRegs((await r.json()) as Reg[]);
    } catch { /* ignore */ }
    finally { setLoadingList(false); }
  }, []);

  useEffect(() => { if (authed) { void fetchRegs(); void fetchSettings(); } }, [authed, fetchRegs, fetchSettings]);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(''); }
    else setPwErr('Incorrect password.');
  };

  const deleteReg = async (id: string) => {
    if (!confirm('Delete this registration? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/registrations/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setRegs(prev => prev.filter(r => r.id !== id));
    } catch { /* ignore */ }
    finally { setDeletingId(null); }
  };

  /* ────── LOGIN ────── */
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a003a 0%,#3d0060 60%,#0a001a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', borderRadius: '22px', padding: '38px 30px', width: '100%', maxWidth: '360px', border: '1px solid rgba(255,215,0,0.2)', boxShadow: '0 30px 70px rgba(0,0,0,0.55)' }}>
          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon1.png" alt="RCCG" style={{ height: '46px', objectFit: 'contain', marginBottom: '14px' }} />
            <h1 style={{ color: 'white', fontSize: '22px', fontWeight: 900, marginBottom: '4px' }}>Admin Portal</h1>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>IDENTITY 2026 · RCCG YAYA SA2</p>
          </div>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter admin password" autoFocus
            style={{ width: '100%', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '11px', padding: '13px 16px', color: 'white', fontSize: '15px', outline: 'none', marginBottom: '10px' }}
            onKeyDown={e => { if (e.key === 'Enter') login(); }} />
          {pwErr && <p style={{ color: '#f87171', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>{pwErr}</p>}
          <button onClick={login} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#FFD700,#FF8C00)', color: '#1a0800', fontSize: '15px', fontWeight: 900, cursor: 'pointer', letterSpacing: '1px' }}>
            Enter Admin →
          </button>
        </div>
      </div>
    );
  }

  /* ────── DASHBOARD ────── */
  const checkedIn = regs.filter(r => r.checkedIn).length;

  const th: React.CSSProperties = { color: '#6b7280', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' };
  const td: React.CSSProperties = { padding: '12px 14px', fontSize: '13px', color: '#d1d5db', verticalAlign: 'middle', borderBottom: '1px solid rgba(255,255,255,0.05)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0d001f 0%,#280050 50%,#0a001a 100%)', padding: '20px 16px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Top bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon1.png" alt="RCCG" style={{ height: '36px', objectFit: 'contain' }} />
            <div>
              <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} /> Admin Dashboard
              </h1>
              <p style={{ color: '#6b7280', fontSize: '11px' }}>IDENTITY 2026 · RCCG YAYA SA2</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a href="/identity2026/scanner" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: 'white', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              <QrCode size={14} /> Check-In
            </a>
            <button onClick={() => setAuthed(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '10px', color: '#9ca3af', padding: '8px 14px', fontSize: '12px', cursor: 'pointer' }}>
              <LogOut size={12} /> Log out
            </button>
          </div>
        </div>

        {/* ── Capacity Settings ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.15)', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#FFD700', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
            <Settings size={14} /> Registration Limit
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={e => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 500"
              style={{ width: '110px', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '9px', padding: '8px 12px', color: 'white', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={() => void saveCapacity()} disabled={savingCap} style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', color: '#1a0800', border: 'none', borderRadius: '9px', padding: '8px 18px', fontSize: '13px', fontWeight: 800, cursor: savingCap ? 'not-allowed' : 'pointer' }}>
              {savingCap ? 'Saving…' : 'Set Limit'}
            </button>
            {capMsg && <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700 }}>{capMsg}</span>}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '12px', flexShrink: 0 }}>
            {savedCapacity !== null
              ? <span>{regCount} / {savedCapacity} registered{regCount >= savedCapacity ? <span style={{ color: '#f87171', fontWeight: 700 }}> · FULL</span> : ''}</span>
              : <span style={{ color: '#4b5563' }}>No limit set — unlimited</span>}
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <StatCard label="Total Registered" value={regs.length} color="#a78bfa" />
          <StatCard label="Signed In" value={checkedIn} color="#4ade80" />
          <StatCard label="Pending" value={regs.length - checkedIn} color="#fbbf24" />
        </div>

        {/* ── Registrations table ── */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.09)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>
              All Registrations
              <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '12px', marginLeft: '8px' }}>({regs.length})</span>
            </p>
            <button onClick={() => void fetchRegs()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#FFD700', cursor: 'pointer', fontSize: '12px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loadingList ? (
            <p style={{ color: '#4b5563', textAlign: 'center', padding: '32px', fontSize: '13px' }}>Loading…</p>
          ) : regs.length === 0 ? (
            <p style={{ color: '#4b5563', textAlign: 'center', padding: '32px', fontSize: '13px' }}>No registrations yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>Name</th>
                    <th style={th}><Mail size={11} style={{ marginRight: 4 }} />Email</th>
                    <th style={th}><Phone size={11} style={{ marginRight: 4 }} />Phone</th>
                    <th style={th}><Building2 size={11} style={{ marginRight: 4 }} />Parish</th>
                    <th style={th}>Gender</th>
                    <th style={th}>Age</th>
                    <th style={th}>Status</th>
                    <th style={th}><Clock size={11} style={{ marginRight: 4 }} />Signed In At</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regs.map((r, i) => (
                    <tr key={r.id} style={{ background: r.checkedIn ? 'rgba(74,222,128,0.04)' : 'transparent' }}>
                      <td style={{ ...td, color: '#6b7280', width: '40px' }}>{i + 1}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: r.checkedIn ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '13px', flexShrink: 0 }}>
                            {r.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{r.fullName}</p>
                            <p style={{ color: '#4b5563', fontSize: '10px', fontFamily: 'monospace' }}>{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td style={td}>{r.email || <span style={{ color: '#374151' }}>—</span>}</td>
                      <td style={td}>{r.phone || <span style={{ color: '#374151' }}>—</span>}</td>
                      <td style={td}>{r.parish || <span style={{ color: '#374151' }}>—</span>}</td>
                      <td style={td}>{r.gender || <span style={{ color: '#374151' }}>—</span>}</td>
                      <td style={td}>{r.age || <span style={{ color: '#374151' }}>—</span>}</td>
                      <td style={td}>
                        {r.checkedIn ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>
                            <Check size={10} /> Signed In
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>Pending</span>
                        )}
                      </td>
                      <td style={{ ...td, color: r.checkedInAt ? '#4ade80' : '#374151' }}>
                        {r.checkedInAt
                          ? new Date(r.checkedInAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: true })
                          : '—'}
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => void deleteReg(r.id)}
                          disabled={deletingId === r.id}
                          title="Delete registration"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171', borderRadius: '8px', padding: '5px 10px', fontSize: '12px', cursor: deletingId === r.id ? 'not-allowed' : 'pointer', opacity: deletingId === r.id ? 0.5 : 1 }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
