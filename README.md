# 🕌 Noor-ul-Quran – Islamic Learning Platform

A full-stack MERN (MongoDB, Express, React, Node.js) Islamic learning platform with Quran, Duas, Dhikr counter, Prayer times, Islamic calendar, and more.

## Features

- **📖 Quran** – Full 114 Surahs, 30 Juz, Arabic + English translation, audio recitation (Alafasy, Abdul Basit), search, bookmarks, last read position
- **🤲 Duas** – Daily duas, morning/evening, Quranic duas, situational supplications
- **📿 Dhikr Counter** – Digital tasbeeh with custom dhikr, save to database, history
- **🕌 Prayer Times** – Auto-detect location, Aladhan API, countdown to next prayer, Hijri date
- **🗓 Islamic Calendar** – Hijri calendar, important dates, Ramadan & Eid countdown
- **🎧 Islamic Audio** – Quran recitations with background player
- **👤 User Auth** – JWT authentication, profile, bookmarks, dhikr history, last read sync

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- **Frontend**: React 18, React Router, Axios, Tailwind CSS, Vite
- **APIs**: Al Quran Cloud, Aladhan (prayer times)

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start

**Prerequisites:** Node.js 18+, MongoDB running locally

1. **Backend** (Terminal 1):
   ```bash
   cd backend && npm install && npm run seed && npm run dev
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend && npm install && npm run dev
   ```

3. Open **http://localhost:5173** in your browser

## Setup (Detailed)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit .env with your MongoDB URI and JWT_SECRET
npm run seed           # Seed sample duas
npm run dev            # Start on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # Start on http://localhost:5173
```

### 3. Environment

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/noor-ul-quran
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Project Structure

```
Noor/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── ...
└── README.md
```

## API Endpoints

- `POST /api/auth/register` – Register
- `POST /api/auth/login` – Login
- `GET /api/auth/profile` – Profile (auth)
- `PUT /api/auth/last-read` – Save last read (auth)
- `GET/POST/DELETE /api/bookmarks` – Bookmarks (auth)
- `GET /api/duas` – List duas
- `POST /api/dhikr` – Save dhikr (auth)
- `GET /api/quran/meta` – Surah list
- `GET /api/quran/surah/:number` – Full surah with translation

## Design

- Islamic green & gold theme
- Amiri Arabic font
- Dark/Light mode
- Responsive, mobile-friendly

Barakallahu feekum.
