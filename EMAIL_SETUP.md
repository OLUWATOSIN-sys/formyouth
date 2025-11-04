# Email Setup Guide

## Option 1: Gmail SMTP (Easiest)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)** → Type "Youth Gala"
4. Click **Generate**
5. Copy the 16-character password (remove spaces)

### Step 3: Add to Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
NEXT_PUBLIC_BASE_URL=https://youthgala.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
```

3. Select all environments (Production, Preview, Development)
4. Click Save
5. Redeploy

### Step 4: Update Bank Details in Email Template
Edit `/lib/email.ts` and update the payment instructions section with your actual bank details.

---

## Option 2: SendGrid (100 emails/day free)

### Setup:
1. Sign up at https://sendgrid.com
2. Create API Key
3. Add to Vercel:

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

---

## Option 3: Resend (3,000 emails/month free)

### Setup:
1. Sign up at https://resend.com
2. Get API Key
3. Add to Vercel:

```
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your-resend-api-key
```

---

## Testing Locally

Add to your `.env` file:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

Then run `npm run dev` and test registration.

---

## Email Features

### 1. Registration Email
- Sent immediately after registration
- Contains payment upload link (24-hour validity)
- Includes bank details and instructions
- Beautiful gold/black themed HTML

### 2. Payment Confirmation Email
- Sent when admin confirms payment
- Confirms successful registration
- Includes event details

---

## Troubleshooting

### Emails not sending?
1. Check Vercel logs for errors
2. Verify SMTP credentials are correct
3. For Gmail: Make sure App Password is used (not regular password)
4. Check spam folder

### Gmail blocking?
- Enable "Less secure app access" (not recommended)
- OR use App Password (recommended)

### Want to customize emails?
Edit `/lib/email.ts` - Update HTML templates with your branding and bank details.
