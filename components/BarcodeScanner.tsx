'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

interface Props {
  /** Called every time a NEW unique QR code is detected (debounced per id). */
  onScan: (text: string) => void;
}

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lastRef = useRef<{ id: string; ts: number }>({ id: '', ts: 0 });
  const [cameraError, setCameraError] = useState('');
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);

  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  const handleResult = useCallback((text: string) => {
    const now = Date.now();
    const last = lastRef.current;
    /* Allow the same ID again only after 4 s to prevent repeated triggers */
    if (text === last.id && now - last.ts < 4000) return;
    lastRef.current = { id: text, ts: now };
    /* Flash feedback */
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    onScanRef.current(text);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCameraError('');
    setReady(false);

    const reader = new BrowserQRCodeReader();

    reader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result) => {
        if (cancelled || !result) return;
        handleResult(result.getText());
      })
      .then(controls => {
        if (cancelled) { controls.stop(); return; }
        controlsRef.current = controls;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setCameraError('Camera access denied. Please allow camera access and try again.');
      });

    return () => {
      cancelled = true;
      try { controlsRef.current?.stop(); } catch { /* ignore */ }
      controlsRef.current = null;
    };
  }, [handleResult]);

  return (
    <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          background: '#000',
        }}
        playsInline
        muted
      />

      {/* Scan-detected flash */}
      {flash && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(74,222,128,0.25)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Starting overlay */}
      {!ready && !cameraError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(255,215,0,0.3)',
              borderTop: '3px solid #FFD700',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: 'white', fontSize: '13px' }}>Starting camera…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* QR guide frame */}
      {ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* dark vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 52% 52% at 50% 50%, transparent 48%, rgba(0,0,0,0.45) 100%)',
            }}
          />
          {/* corner brackets */}
          {[
            { top: 0, left: 0 },
            { top: 0, right: 0 },
            { bottom: 0, left: 0 },
            { bottom: 0, right: 0 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: '28px',
                height: '28px',
                borderColor: '#FFD700',
                borderStyle: 'solid',
                borderWidth: 0,
                ...(i === 0 && { borderTopWidth: 3, borderLeftWidth: 3, borderRadius: '4px 0 0 0' }),
                ...(i === 1 && { borderTopWidth: 3, borderRightWidth: 3, borderRadius: '0 4px 0 0' }),
                ...(i === 2 && { borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: '0 0 0 4px' }),
                ...(i === 3 && { borderBottomWidth: 3, borderRightWidth: 3, borderRadius: '0 0 4px 0' }),
              }}
            />
          ))}
          <div
            style={{
              width: '180px',
              height: '180px',
              border: '2px solid rgba(255,215,0,0.35)',
              borderRadius: '8px',
            }}
          />
        </div>
      )}

      {cameraError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center' }}>{cameraError}</p>
        </div>
      )}
    </div>
  );
}
