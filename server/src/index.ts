import 'dotenv/config';
import http from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import type { Response } from 'express';
import cors from 'cors';
import jose from 'node-jose';
import path from 'node:path';
import connectDB from './db/index.js';
import { PUBLIC_KEY } from './utils/cert.js';
import authRoutes from './routes/auth.routes.js';
import pollRoutes from './routes/poll.routes.js';
import pollResponseRoutes from './routes/pollResponse.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

const PORT = process.env.PORT ?? 8000;

connectDB(process.env.DATABASE_URL!)
  .then(() => console.log('MongoDB Database Connected'))
  .catch((err) =>
    console.log(`Error in connecting to MongoDB Database: ${err}`)
  );

const allowedOrigins = [
  process.env.CLIENT_LOCAL_URL!,
  process.env.CLIENT_URL!,
  process.env.CLIENT_LOCAL_URL!,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.static(path.resolve('public')));

app.get('/', (_, res) => {
  return res.status(200).json({
    message: 'Server started running',
  });
});

app.get('/health', (_, res) => res.json({ ok: true }));

// OIDC endpoints
app.get('/.well-known/openid-configuration', (_, res: Response) => {
  const ISSUER = `http://localhost:${PORT}`;
  return res.json({
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/o/authenticate`,
    userinfo_endpoint: `${ISSUER}/o/userinfo`,
    jwks_uri: `${ISSUER}/.well-known/jwks.json`,
  });
});

app.get('/.well-known/jwks.json', async (_, res: Response) => {
  const key = await jose.JWK.asKey(PUBLIC_KEY!, 'pem');
  return res.json({ keys: [key.toJSON()] });
});

app.use('/o', authRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/poll-response', pollResponseRoutes);
app.use('/api/analytics', analyticsRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL!,
    methods: ['GET', 'POST', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected');

  socket.on('join_poll', (pollId) => {
    socket.join(pollId);
  });
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server started running on http://localhost:${PORT}`);
});

export { io };
