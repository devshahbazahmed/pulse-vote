import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'node:path';

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(express.static(path.resolve('/public')));

app.get('/', (_, res) => {
  return res.status(200).json({
    message: 'Server started running',
  });
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server started running on http://localhost:${PORT}`);
});
