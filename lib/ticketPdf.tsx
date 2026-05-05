import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface TicketData {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  parish?: string;
}

/* ─── dimensions ─── */
const TW = 842;   // total width
const TH = 300;   // total height
const SW = 236;   // stub width
const MW = TW - SW; // main width = 606

/* ─── Styles ─── */
const S = StyleSheet.create({
  page: {
    width: TW,
    height: TH,
    flexDirection: 'row',
    backgroundColor: '#1a0035',
  },

  /* ── Main section ── */
  main: {
    width: MW,
    height: TH,
    position: 'relative',
    overflow: 'hidden',
  },
  bgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MW,
    height: TH,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MW,
    height: TH,
    backgroundColor: 'rgba(18,0,45,0.78)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: MW,
    height: TH,
    flexDirection: 'column',
    padding: 18,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255,215,0,0.2)',
  },
  logo: {
    height: 44,
    objectFit: 'contain',
  },
  brandCol: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  brandYAYA: {
    color: '#FFD700',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 4,
  },
  brandID: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    lineHeight: 1,
  },
  brandYear: {
    color: '#FFD700',
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },

  /* Mid row: left col + right col */
  midRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 14,
  },
  midLeft: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  midRight: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },

  /* Date / Time large display */
  dtRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 6,
  },
  dtBlock: {
    flexDirection: 'column',
  },
  dtLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 7,
    fontFamily: 'Helvetica',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  dtNum: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  dtPipe: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 34,
    paddingBottom: 2,
  },

  /* TRANSFIGURED banner image */
  banner: {
    width: '100%',
    height: 48,
    objectFit: 'contain',
    objectPosition: 'left',
  },

  /* Name card */
  nameCard: {
    borderRadius: 6,
    backgroundColor: 'rgba(255,215,0,0.10)',
    borderLeft: '3px solid #FFD700',
    padding: '8 12',
  },
  nameCardLabel: {
    color: '#FFD700',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 4,
    marginBottom: 4,
  },
  nameCardName: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.3,
  },
  nameCardSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 8,
    fontFamily: 'Helvetica',
    marginTop: 3,
  },

  /* Bottom venue bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.12)',
    paddingTop: 7,
    marginTop: 2,
    gap: 10,
  },
  btLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 7,
    fontFamily: 'Helvetica',
    letterSpacing: 2,
  },
  btValue: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  btPipe: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
  },

  /* ── Stub ── */
  stub: {
    width: SW,
    height: TH,
    backgroundColor: '#4c1d95',
    borderLeft: '2.5px dashed rgba(255,255,255,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '14 10',
    gap: 6,
  },
  vertCol: {
    width: 14,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2.5,
    flexShrink: 0,
  },
  vertChar: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1,
  },
  qrCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  qrBox: {
    backgroundColor: 'white',
    padding: 7,
    borderRadius: 6,
  },
  qrImg: {
    width: 155,
    height: 155,
  },
  ticketNo: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
});

/* ─── Vertical text helper ─── */
function VerticalText({ label }: { label: string }) {
  return (
    <View style={S.vertCol}>
      {label.split('').map((ch, i) => (
        <Text key={i} style={S.vertChar}>
          {ch === ' ' ? '\u00A0' : ch}
        </Text>
      ))}
    </View>
  );
}

/* ─── PDF document ─── */
interface DocProps {
  data: TicketData;
  qrDataUrl: string;
  logoDataUrl: string;
  bannerDataUrl: string;
  bgDataUrl: string;
}

function TicketDocument({ data, qrDataUrl, logoDataUrl, bannerDataUrl, bgDataUrl }: DocProps) {
  return (
    <Document title={`IDENTITY 2026 — ${data.fullName}`} author="RCCG YAYA SA2">
      <Page size={[TW, TH]} style={S.page}>

        {/* ══════════ MAIN SECTION ══════════ */}
        <View style={S.main}>
          {/* Background photo */}
          <Image src={bgDataUrl} style={S.bgImg} />
          {/* Dark purple overlay */}
          <View style={S.overlay} />

          {/* Foreground content */}
          <View style={S.content}>

            {/* ── TOP BAR: logo + branding ── */}
            <View style={S.topBar}>
              <Image src={logoDataUrl} style={S.logo} />
              <View style={S.brandCol}>
                <Text style={S.brandYAYA}>YAYA SA 2</Text>
                <Text style={S.brandID}>IDENTITY</Text>
                <Text style={S.brandYear}>2026</Text>
              </View>
            </View>

            {/* ── MIDDLE: date/banner | name ── */}
            <View style={S.midRow}>

              {/* Left: date + time + TRANSFIGURED */}
              <View style={S.midLeft}>
                <View style={S.dtRow}>
                  <View style={S.dtBlock}>
                    <Text style={S.dtLabel}>DATE:</Text>
                    <Text style={S.dtNum}>JUNE 16</Text>
                  </View>
                  <Text style={S.dtPipe}>|</Text>
                  <View style={S.dtBlock}>
                    <Text style={S.dtLabel}>TIME:</Text>
                    <Text style={S.dtNum}>9AM</Text>
                  </View>
                </View>
                <Image src={bannerDataUrl} style={S.banner} />
              </View>

              {/* Right: name card */}
              <View style={S.midRight}>
                <View style={S.nameCard}>
                  <Text style={S.nameCardLabel}>NAME</Text>
                  <Text style={S.nameCardName}>{data.fullName}</Text>
                  {data.parish
                    ? <Text style={S.nameCardSub}>{data.parish}</Text>
                    : null}
                  {data.email
                    ? <Text style={S.nameCardSub}>{data.email}</Text>
                    : null}
                </View>
              </View>

            </View>

            {/* ── BOTTOM BAR ── */}
            <View style={S.bottomBar}>
              <Text style={S.btLabel}>DATE:</Text>
              <Text style={S.btValue}>JUNE 16</Text>
              <Text style={S.btPipe}>|</Text>
              <Text style={S.btLabel}>TIME:</Text>
              <Text style={S.btValue}>9AM</Text>
              <Text style={S.btPipe}>|</Text>
              <Text style={S.btLabel}>VENUE:</Text>
              <Text style={S.btValue}>Friend of God Campus, Cape Town</Text>
            </View>

          </View>
        </View>

        {/* ══════════ STUB ══════════ */}
        <View style={S.stub}>
          <VerticalText label="TICKET ADMITS ONE" />
          <View style={S.qrCol}>
            <View style={S.qrBox}>
              <Image src={qrDataUrl} style={S.qrImg} />
            </View>
            <Text style={S.ticketNo}>No. {data.id}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}

/* ─── helpers ─── */
function fileToDataUrl(filePath: string, mime: string): string {
  const buf = fs.readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function resizedBgDataUrl(): Promise<string> {
  const src = path.join(process.cwd(), 'public', 'bg.png');
  const buf = await sharp(src)
    .resize(842, 300, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 72 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

export async function generateTicketPDF(data: TicketData, baseUrl: string): Promise<Buffer> {
  const ticketUrl = `${baseUrl}/ticket/${data.id}`;

  const [qrDataUrl, logoDataUrl, bannerDataUrl, bgDataUrl] = await Promise.all([
    QRCode.toDataURL(ticketUrl, { width: 310, margin: 1, errorCorrectionLevel: 'M' }),
    Promise.resolve(fileToDataUrl(path.join(process.cwd(), 'public', 'icon1.png'), 'image/png')),
    Promise.resolve(fileToDataUrl(path.join(process.cwd(), 'public', 'icon2.png'), 'image/png')),
    resizedBgDataUrl(),
  ]);

  return renderToBuffer(
    <TicketDocument
      data={data}
      qrDataUrl={qrDataUrl}
      logoDataUrl={logoDataUrl}
      bannerDataUrl={bannerDataUrl}
      bgDataUrl={bgDataUrl}
    />,
  ) as Promise<Buffer>;
}
