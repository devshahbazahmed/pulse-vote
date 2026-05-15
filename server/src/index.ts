import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jose from 'node-jose';
import path from 'node:path';
import connectDB from './db';
import { PUBLIC_KEY } from './utils/cert';
import authRoutes from './routes/auth.routes';

const app = express();

const PORT = process.env.PORT ?? 8000;

connectDB(process.env.DATABASE_URL!)
  .then(() => console.log('MongoDB Database Connected'))
  .catch((err) =>
    console.log(`Error in connecting to MongoDB Database: ${err}`)
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

app.use('/o/', authRoutes);

app.listen(PORT, () => {
  console.log(`Server started running on http://localhost:${PORT}`);
});
