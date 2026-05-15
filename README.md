# Pulse Vote

Pulse Vote is a full-stack polling app. Users can sign in, create polls with multiple questions, collect responses, publish results, and view analytics.

## Demo Login

Use these credentials to test the app:

```txt
Email: test@test.com
Password: 123456
```

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Backend: Express, TypeScript, Bun
- Database: MongoDB with Mongoose
- Auth: JWT signed with RSA keys
- Realtime: Socket.IO events for poll/result updates

## Features

- Sign up and sign in
- JWT-based authenticated dashboard
- Create polls with multiple questions and options
- Anonymous poll response submission
- Publish poll results
- View response analytics with vote bars
- Dark blue responsive UI

## Project Structure

```txt
pulse-vote/
  client/        React frontend
  server/        Express API
```

Important frontend files:

```txt
client/src/App.tsx
client/src/components/
client/src/lib/api.ts
client/src/types.ts
```

Important backend files:

```txt
server/src/index.ts
server/src/routes/
server/src/controllers/
server/src/models/
```

## Prerequisites

- Node.js 20.19+ recommended for Vite
- Bun
- MongoDB connection string
- OpenSSL for generating JWT keys

## Backend Setup

Go to the server folder:

```bash
cd server
```

Install dependencies:

```bash
bun install
```

Create an environment file:

```bash
cp .env.example .env
```

Update `server/.env`:

```env
PORT=8000
DATABASE_URL="your-mongodb-connection-string"
```

Generate RSA keys for JWT signing:

```bash
bash key-gen.sh
```

Start the backend:

```bash
bun run dev
```

The API runs at:

```txt
http://localhost:8000
```

## Frontend Setup

Open a second terminal and go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The app runs at:

```txt
http://localhost:5173
```

If your backend is not running on `http://localhost:8000`, create `client/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## API Overview

Auth:

```txt
POST /o/authenticate/sign-up
POST /o/authenticate/sign-in
GET  /o/userinfo
```

Polls:

```txt
POST  /api/poll
GET   /api/poll
GET   /api/poll/:id
PATCH /api/poll/:id/publish
GET   /api/poll/:id/results
```

Responses:

```txt
POST /api/poll-response/:id/respond
```

Analytics:

```txt
GET /api/analytics/:id/analytics
```

## Useful Commands

Frontend:

```bash
cd client
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
bun run dev
bun run build
```

## Notes

- The server reads JWT keys from `server/cert/private-key.pem` and `server/cert/public-key.pub`.
- Run backend commands from the `server` directory so the certificate paths resolve correctly.
- The demo credentials require that the user exists in your database.
