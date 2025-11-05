import nodemailer from "nodemailer";

// Create reusable transporter with hardcoded credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "rccggala@gmail.com",
    pass: "lhszogcayohmthtx",
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log("📧 Email transporter initialized");

export async function sendPaymentUploadEmail(
  to: string,
  name: string,
  uploadLink: string,
  guests: string,
  ticketType: string = "regular"
) {
  const pricePerPerson = ticketType === "vip" ? 1500 : 500;
  const amount = parseInt(guests) * pricePerPerson;
  const ticketLabel = ticketType === "vip" ? "VIP" : "Regular";

  const mailOptions = {
    from: `"Youth Gala 2025" <rccggala@gmail.com>`,
    to: to,
    subject: "Youth Gala 2025 - Complete Your Registration",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); border: 2px solid #D4AF37; border-radius: 10px; padding: 30px; color: #fff; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
          h1 { color: #D4AF37; font-size: 32px; margin: 0; text-transform: uppercase; }
          h3, h4 { color: #D4AF37; }
          .gold { color: #FFD700; }
          .content { line-height: 1.6; color: #fff; }
          .content p { color: #fff; }
          .button { display: inline-block; background: linear-gradient(90deg, #B8941E 0%, #D4AF37 50%, #FFD700 100%); color: #000; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .info-box { background: rgba(212, 175, 55, 0.1); border: 1px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 20px 0; color: #fff; }
          .info-box p { color: #fff; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
          .warning { color: #ff6b6b; font-weight: bold; }
          strong { color: #FFD700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Youth Gala 2025</h1>
            <p class="gold">Theme: ROYALTY</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            
            <p>Thank you for registering for the <strong>Youth Gala 2025</strong>! We're excited to have you join us for this prestigious event.</p>
            
            <div class="info-box">
              <h3 style="color: #D4AF37; margin-top: 0;">Registration Details:</h3>
              <p><strong>Ticket Type:</strong> ${ticketLabel}</p>
              <p><strong>Number of Guests:</strong> ${guests}</p>
              <p><strong>Price Per Person:</strong> R${pricePerPerson}</p>
              <p><strong>Total Amount:</strong> R${amount}</p>
              <p><strong>Event Date:</strong> 29th November 2025</p>
              <p><strong>Dress Code:</strong> Royal Attire</p>
            </div>
            
            <h3 style="color: #D4AF37;">Next Step: Upload Proof of Payment</h3>
            
            <p>To complete your registration, please make your payment and upload proof using the link below:</p>
            
            <div style="text-align: center;">
              <a href="${uploadLink}" class="button">UPLOAD PROOF OF PAYMENT</a>
            </div>
            
            <p class="warning">⚠️ Important: This link is valid for 24 hours only!</p>
            
            <div class="info-box">
              <h4 style="color: #FFD700; margin-top: 0;">Payment Instructions:</h4>
              <p style="margin-bottom: 15px;"><strong style="color: #D4AF37;">Standard Bank Details:</strong></p>
              <p><strong>Account Name:</strong> Temitope Olaniran</p>
              <p><strong>Account Number:</strong> 208281622</p>
              <p><strong>Bank:</strong> Standard Bank</p>
              <p><strong>Reference:</strong> ${name.replace(/\s+/g, '')}</p>
              
              <p style="margin-top: 20px; margin-bottom: 10px;"><strong style="color: #D4AF37;">Or use eWallet:</strong></p>
              <p><strong>eWallet Number:</strong> +27 65 879 1180</p>
            </div>
            
            <p>After making payment, click the button above to upload your proof of payment (bank receipt or screenshot).</p>
            
            <h3 style="color: #D4AF37; margin-top: 40px;">Need Style Inspiration?</h3>
            <p>Check out our Royal Attire Moodboard for outfit ideas!</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://rccgyouthheavensgate.org/moodboard" style="text-decoration: none;">
                <img src="https://rccgyouthheavensgate.org/MOOD%20BOARD_design.png" alt="Moodboard" style="max-width: 100%; height: auto; border: 2px solid #D4AF37; border-radius: 8px; display: block; margin: 0 auto;" />
              </a>
              <p style="margin-top: 10px;">
                <a href="https://rccgyouthheavensgate.org/moodboard" style="color: #FFD700; text-decoration: none; font-weight: bold;">👑 View Full Moodboard Gallery →</a>
              </p>
            </div>
            
            <p style="margin-top: 30px;">We look forward to seeing you!</p>
            <p><strong style="color: #D4AF37;">Rccg Heaven's Gate Youth</strong></p>
          </div>
          
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log("Sending email from: rccggala@gmail.com to:", to);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("SMTP Config:", {
      host: "smtp.gmail.com",
      port: 587,
      user: "rccggala@gmail.com",
      hasPassword: true
    });
    return { success: false, error };
  }
}

export async function sendPaymentConfirmationEmail(
  to: string,
  name: string
) {
  const mailOptions = {
    from: `"Youth Gala 2025" <rccggala@gmail.com>`,
    to: to,
    subject: "Youth Gala 2025 - Payment Confirmed! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #000 100%); border: 2px solid #D4AF37; border-radius: 10px; padding: 30px; color: #fff; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #D4AF37; font-size: 32px; margin: 0; }
          h2, h3 { color: #D4AF37; }
          .gold { color: #FFD700; }
          .success { background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .info-box { background: rgba(212, 175, 55, 0.1); border: 1px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 20px 0; color: #fff; }
          .info-box p { color: #fff; }
          p { color: #fff; }
          strong { color: #FFD700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Payment Confirmed!</h1>
          </div>
          
          <div class="success">
            <h2 style="color: #4CAF50; margin: 0;">Your registration is complete!</h2>
          </div>
          
          <p>Dear <strong>${name}</strong>,</p>
          
          <p>Great news! Your payment has been confirmed and your registration for <strong>Youth Gala 2025</strong> is now complete.</p>
          
          <div class="info-box">
            <h3 style="color: #D4AF37; margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> 29th November 2025</p>
            <p><strong>Theme:</strong> ROYALTY</p>
            <p><strong>Dress Code:</strong> Royal Attire</p>
            <p><strong>Entry Fee:</strong> R500 per person</p>
          </div>
          
          <p>We look forward to seeing you at the event! Get ready for an unforgettable night of celebration.</p>
          
          <p>If you have any questions, contact us at <a href="mailto:info@cccyouth.com" style="color: #D4AF37;">info@cccyouth.com</a></p>
          
          <p style="margin-top: 30px;"><strong style="color: #D4AF37;">See you there!</strong></p>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
            <p>© 2025 CCC Youth Gala. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}
