# TRINETRA - Tourist Safety & Tracking System

TRINETRA is a comprehensive web platform built to ensure the safety and seamless verification of tourists. It features a digital ID system with QR codes, real-time live SOS mapping, and an Authority Command Center to manage and dispatch emergency services.

## Architecture
This project is built using a modern full-stack JavaScript architecture:
- **Frontend (Client):** Next.js, React, Tailwind CSS, Zustand, Google Maps API
- **Backend (Server):** Node.js, Express, MongoDB, Mongoose, JWT Authentication

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1. Clone & Install Dependencies

**Install Backend Dependencies:**
```bash
cd server
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

### 2. Environment Variables Configuration

You need to create `.env` files for both the server and the client.

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trinetra  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Frontend (`client/.env.local`)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Database Seeding (First Run)

To use the Authority Command Center, you need an authority account. We have provided a script to seed the database with an initial authority user.

Ensure your MongoDB instance is running, then execute:

```bash
cd server
node seedAuthority.js
```

This will create an authority account with the following credentials:
- **Email:** `authority@trinetra.gov.in`
- **Password:** `password123`

### 4. Running the Application

You will need two separate terminal windows to run both the frontend and the backend simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd server
node index.js
```
*The server will start running on `http://localhost:5000`.*

**Terminal 2: Start the Frontend Client**
```bash
cd client
npm run dev
```
*The client will start running on `http://localhost:3000`.*

---

## 🛠️ Usage Guide

Once both servers are running, open `http://localhost:3000` in your browser.

### As an Authority:
1. Log in using the seeded credentials (`authority@trinetra.gov.in` / `password123`).
2. You will land on the **Central Command Center (Dashboard)**.
3. From here, you can manage **Tourist Verification** (Approve, Reject, or Edit details) via the table at the bottom.
4. Click on **Live Fleet Map** to view the map. If a tourist triggers an SOS, it will immediately appear here as a pulsing red marker, allowing you to dispatch help.

### As a Tourist:
1. From the homepage, click **Register** to create a new account.
2. Complete your profile and submit your ID for verification.
3. Once verified by an Authority, your digital ID and QR code will be generated.
4. You can access the **Live Map / Track** page to broadcast an SOS signal in case of an emergency. The signal will include your exact GPS coordinates and device battery level.
