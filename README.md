# 🎨 ArtNode - Artifact Experience Platform

ArtNode is a modern, full-stack platform designed for museums and galleries to turn physical artifacts into digital, interactive experiences. It provides a suite of tools for artifact management, 3D visualization, and real-time analytics.

## 🚀 Features

- **QR Studio**: Generate and customize professional QR codes for artifacts with custom colors and integrated branding.
- **3D Showcase**: Interactive 3D model viewer (GLB) with AR support for artifact inspection.
- **Audio Guides**: Integrated audio narration for each artifact.
- **Advanced Analytics**: Track scans, engagement (ratings), and viewing durations in real-time.
- **Feedback System**: Allow visitors to leave star ratings and comments directly on the artifact page.
- **Mobile First**: Fully responsive experience optimized for instant mobile access via QR.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://reactjs.org/) (Vite + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) v5
- **QR Rendering**: [react-qrcode-logo](https://www.npmjs.com/package/react-qrcode-logo)

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (for high-perf QR generation)
- **Storage**: Supabase Buckets (for 3D models, Audio, and Thumbnails)

---

## ⚙️ Local Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Supabase](https://supabase.com/) account (Free tier works perfectly)

### 2. Backend Setup

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file (see [Environment Variables](#environment-variables) section below).
4.  Run Prisma migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the development server:
    ```bash
    npm run start:dev
    ```

### 3. Frontend Setup

1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your `.env` file with `VITE_API_BASE_URL`.
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🌍 Environment Variables

### Backend (`/backend/.env`)

```env
DATABASE_URL="your_postgresql_url"
DIRECT_URL="your_direct_db_url"
SUPABASE_URL="your_supabase_project_url"
SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_JWT_SECRET="your_jwt_secret"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
FRONTEND_URL="http://localhost:5173" # Update when deploying
```

### Frontend (`/frontend/.env`)

```env
VITE_API_BASE_URL="http://localhost:3000" # Update when deploying
```

---

## 🚢 Deployment Guide (The "ArtNode Stack")

### Backend Deployment (Recommended: Render/Railway)

1.  Push your backend code to GitHub.
2.  Connect the repo to [Render.com](https://render.com).
3.  Build Command: `npm install && npm run build`
4.  Start Command: `npm run start:prod`
5.  Add all `.env` variables in the dashboard settings.

### Frontend Deployment (Recommended: Vercel)

1.  Push your frontend code to GitHub.
2.  Connect to [Vercel](https://vercel.com).
3.  Set `VITE_API_BASE_URL` to your live backend URL.
4.  Ensure `FRONTEND_URL` in the **backend's** env is updated to your Vercel URL so QR codes work correctly.
