# MongoDB Setup Instructions for Vercel

## Setting Up MongoDB Database

Your Youth Gala registration system now uses MongoDB Atlas (which you already have set up!).

### Step 1: Get Your MongoDB Connection String

From your MongoDB Atlas dashboard, you already have:
```
mongodb+srv://<db_username>:<db_password>@cluster0.etk9wv5.mongodb.net/?appName=Cluster0
```

### Step 2: Create Database User (If Not Done)

1. In MongoDB Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (remember these!)
4. Set permissions to **Read and write to any database**
5. Click **Add User**

### Step 3: Whitelist Vercel IPs

1. In MongoDB Atlas, go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is safe because your connection string has authentication
4. Click **Confirm**

### Step 4: Add Environment Variable to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your `formyouth` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://<db_username>:<db_password>@cluster0.etk9wv5.mongodb.net/?appName=Cluster0`
   - Replace `<db_username>` and `<db_password>` with your actual credentials
5. Select all environments (Production, Preview, Development)
6. Click **Save**

### Step 5: Redeploy

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Your site will redeploy with MongoDB connected!

## How It Works

- **Registrations** are stored in MongoDB Atlas cloud database
- **Database**: `youthgala`
- **Collection**: `registrations`
- **Data persists** forever
- **Free tier** includes 512MB storage (plenty for thousands of registrations)
- **Fast and reliable** - perfect for production

## Admin Access

- **URL**: `https://youthgala.vercel.app/admin`
- **Password**: `YouthGala2025!`

## Local Development

1. Copy `env.example` to `.env.local`
2. Add your MongoDB connection string
3. Run `npm run dev`
