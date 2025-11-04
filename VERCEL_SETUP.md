# Vercel Setup Instructions

## Setting Up Vercel KV Database

To make the registration system work on Vercel, you need to set up Vercel KV (Redis database):

### Step 1: Create Vercel KV Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on "Storage" in the top navigation
3. Click "Create Database"
4. Select "KV" (Key-Value Store)
5. Name it: `youth-gala-db`
6. Click "Create"

### Step 2: Connect to Your Project

1. After creating the database, click "Connect Project"
2. Select your `formyouth` project
3. Vercel will automatically add the required environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

### Step 3: Deploy

1. Push your code to GitHub (already done)
2. Vercel will automatically redeploy with the KV database connected
3. Your registration system will now work!

## How It Works

- **Registrations** are stored in Vercel KV (Redis)
- **Data persists** across deployments
- **Free tier** includes 30,000 commands/month (more than enough)
- **Fast and reliable** - perfect for production

## Admin Access

- **URL**: `https://youthgala.vercel.app/admin`
- **Password**: `YouthGala2025!`

## Alternative: Use Google Sheets (No Database Setup)

If you prefer not to set up Vercel KV, I can integrate with Google Sheets instead, which requires:
1. Google Sheets API setup
2. Service account credentials
3. Shared spreadsheet

Let me know if you'd prefer this approach!
