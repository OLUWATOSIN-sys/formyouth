const nodemailer = require("nodemailer");

// Test email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rccggala@gmail.com",
    pass: "lhszogcayohmthtx",
  },
});

async function testEmail() {
  try {
    console.log("Testing SMTP connection...");
    
    // Verify connection
    await transporter.verify();
    console.log("✅ SMTP connection successful!");
    
    // Send test email
    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: '"Youth Gala Test" <rccggala@gmail.com>',
      to: "rccggala@gmail.com", // Send to yourself for testing
      subject: "Test Email from Youth Gala System",
      html: `
        <h1>Test Email</h1>
        <p>If you receive this, the email system is working!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    });
    
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    
  } catch (error) {
    console.error("❌ Email test failed:");
    console.error(error);
    
    if (error.code === "EAUTH") {
      console.log("\n⚠️  Authentication failed. Possible issues:");
      console.log("1. App password might be incorrect");
      console.log("2. 2-Factor Authentication might not be enabled");
      console.log("3. App password might have been revoked");
    }
  }
}

testEmail();
