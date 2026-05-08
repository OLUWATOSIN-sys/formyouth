import nodemailer from 'nodemailer';
import { generateTicketPDF, type TicketData } from './ticketPdf';


function emailHtml(data: TicketData, ticketUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d001f;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6)">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#3d0060 0%,#8B0000 60%,#c05800 100%);padding:36px 32px;text-align:center">
      <p style="color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">RCCG YAYA SA2 PRESENTS</p>
      <h1 style="color:#FFD700;font-size:36px;margin:0;letter-spacing:4px;font-weight:900">IDENTITY 2026</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;letter-spacing:2px">THEME: TRANSFIGURED</p>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#1a0030;padding:32px">
      <p style="color:rgba(255,255,255,0.9);font-size:15px;margin:0 0 8px">Dear <strong style="color:#FFD700">${data.fullName}</strong>,</p>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;line-height:1.7;margin:0 0 24px">
        Your registration for <strong style="color:white">IDENTITY 2026</strong> is confirmed.
        Your ticket is attached as a PDF — please save it and present the QR code at the entrance.
      </p>

      <!-- TICKET CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:14px;border:1px solid rgba(255,215,0,0.25);margin-bottom:24px">
        <tr>
          <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.08)">
            <p style="color:#FFD700;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px">REGISTERED ATTENDEE</p>
            <p style="color:white;font-size:20px;font-weight:800;margin:0">${data.fullName}</p>
            ${data.parish ? `<p style="color:rgba(255,255,255,0.55);font-size:12px;margin:4px 0 0">${data.parish}</p>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:24px">
                  <p style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;margin:0 0 2px">DATE</p>
                  <p style="color:white;font-size:15px;font-weight:700;margin:0">Thursday, June 16, 2026</p>
                </td>
                <td style="padding-right:24px">
                  <p style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;margin:0 0 2px">TIME</p>
                  <p style="color:white;font-size:15px;font-weight:700;margin:0">9:00 AM</p>
                </td>
                <td>
                  <p style="color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:2px;margin:0 0 2px">VENUE</p>
                  <p style="color:white;font-size:15px;font-weight:700;margin:0">Friend of God Campus, Cape Town</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- IMPORTANT INFO -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,215,0,0.07);border-radius:12px;border:1px solid rgba(255,215,0,0.2);margin-bottom:28px">
        <tr>
          <td style="padding:16px 20px">
            <p style="color:#FFD700;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">IMPORTANT INFORMATION</p>
            <p style="color:rgba(255,255,255,0.7);font-size:12px;line-height:1.7;margin:0">
              No own food or drinks may be taken into the venue. Restaurants and bar are available on the day.
              <br>Strobe lighting, smoke and other intense flashing lights will be used during this event.
            </p>
          </td>
        </tr>
      </table>

      <!-- VIEW TICKET BUTTON -->
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding-bottom:28px">
            <a href="${ticketUrl}" style="display:inline-block;background:linear-gradient(135deg,#FFD700,#FF8C00);color:#1a0800;font-size:14px;font-weight:800;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:1px">
              View Ticket Online
            </a>
          </td>
        </tr>
      </table>

      <p style="color:rgba(255,255,255,0.45);font-size:12px;line-height:1.6;margin:0">
        We look forward to seeing you! — RCCG YAYA SA2
      </p>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#0d001f;padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.07)">
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0">
        RCCG YAYA SA2 &bull; Cape Town, South Africa &bull; IDENTITY 2026
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendTicketEmail(
  data: TicketData,
  baseUrl: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const ticketUrl = `${baseUrl}/ticket/${data.id}`;
  const pdfBuffer = await generateTicketPDF(data, baseUrl);

  await transporter.sendMail({
    from: `"RCCG YAYA SA2 — IDENTITY 2026" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: 'Your IDENTITY 2026 Ticket — RCCG YAYA SA2',
    html: emailHtml(data, ticketUrl),
    attachments: [
      {
        filename: `Identity-2026-Ticket-${data.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
