import 'dotenv/config';
import type { Request, Response } from 'express';
import type { JWTClaims } from '../utils/user-token.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../utils/cert.js';
import path from 'node:path';

type RequestWithUser = Request & { user?: JWTClaims };

const PORT = process.env.PORT ?? 8000;

function buildClientRedirectURI(
  redirect_uri: string,
  token: string,
  state?: string
) {
  if (!redirect_uri) return null;

  try {
    const redirect = new URL(redirect_uri);
    redirect.searchParams.set('token', token);
    if (state) redirect.searchParams.set('state', state);
    return redirect.toString();
  } catch (error) {
    return null;
  }
}

async function authenticatController(req: Request, res: Response) {
  return res.sendFile(path.resolve('public', 'authenticate.html'));
}

async function signinController(req: Request, res: Response) {
  const { email, password, redirect_uri, state } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const ISSUER = `http://localhost:${PORT}`;
  const now = Math.floor(Date.now() / 1000);
  const claims: JWTClaims = {
    iss: ISSUER,
    sub: user._id.toString(),
    email: user.email,
    email_verified: user.isEmailVerified,
    exp: now + 60 * 60, // 1 hour
    given_name: user.username,
    name: user.username,
  };

  const token = jwt.sign(claims, PRIVATE_KEY!, { algorithm: 'RS256' });
  const redirectURL = buildClientRedirectURI(redirect_uri, token, state);
  return res.json({ token, redirectURL });
}

async function signupController(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ error: 'Username, email and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: 'User with this email already exists' });
  }

  const newUser = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  return res.status(201).json({
    message: 'User created successfully',
    userInfo: { id: newUser._id },
  });
}

async function userinfoController(req: RequestWithUser, res: Response) {
  const claims = req.user as JWTClaims;

  const user = await User.findById(claims.sub);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }

  return res.json({
    sub: claims.sub,
    email: user.email,
    username: user.username,
    isEmailVerified: user.isEmailVerified,
    given_name: user.username,
    name: user.username,
  });
}

export {
  signinController,
  signupController,
  userinfoController,
  authenticatController,
};
