'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Called every time a NEW unique QR code is detected (debounced per id). */
  onScan: (text: string) => void;
}

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<{ id: string; ts: number }>({ id: '', ts: 0 });
  const [cameraError, setCameraError] = useState('');
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);

  const onScanRef = useRef(onScan);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  useEffect(() => {
    let cancelled = false;
    setCameraError('');
    setReady(false);

    const canvasEl = document.createElement('canvas');
    const ctx = canvasEl.getContext('2d', { willReadFrequently: true })!;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        if (cancelled) return;
        setReady(true);

        // @ts-expect-error — BarcodeDetector is not yet in TS lib but available in modern browsers
        const detector = new (window.BarcodeDetector ?? BarcodeDetector)({ formats: ['qr_code'] });

        function tick() {
          if (cancelled) return;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasEl.width = video.videoWidth;
            canvasEl.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            detector.detect(canvasEl).then((codes: { rawValue: string }[]) => {
              if (cancelled || !codes.length) return;
              const text = codes[0].rawValue;
              const now = Date.now();
              const last = lastRef.current;
              if (text === last.id && now - last.ts < 4000) return;
              lastRef.current = { id: text, ts: now };
              setFlash(true);
              setTimeout(() => setFlash(false), 300);
              onScanRef.current(text);
            }).catch(() => { /* detection error — skip frame */ });
          }
          rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setCameraError('Camera access denied. Please allow camera access and try again.');
      }
    }

    void start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, []);

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
