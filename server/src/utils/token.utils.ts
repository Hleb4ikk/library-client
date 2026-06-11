import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

import { appConfig } from '@/appConfig.js';

export interface AccessTokenPayload {
  userId: string;
}

const BEARER_SCHEME = 'bearer';

const accessTokenSignOptions: SignOptions = {
  algorithm: 'HS256',
  expiresIn: appConfig.jwt.accessTokenExpiresIn as NonNullable<
    SignOptions['expiresIn']
  >,
};

function parseAccessTokenPayload(payload: JwtPayload | string): AccessTokenPayload {
  if (typeof payload === 'string') {
    throw new Error('Invalid token payload');
  }

  const { userId } = payload;

  if (typeof userId !== 'string' || userId.length === 0) {
    throw new Error('Invalid token payload: userId is required');
  }

  return { userId };
}

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, appConfig.jwt.secret, accessTokenSignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret, {
      algorithms: ['HS256'],
    });

    return parseAccessTokenPayload(decoded);
  } catch {
    return null;
  }
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  const decoded = jwt.decode(token);

  if (!decoded) {
    return null;
  }

  try {
    return parseAccessTokenPayload(decoded);
  } catch {
    return null;
  }
}

export function extractBearerToken(
  authorizationHeader: string | undefined,
): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, ...tokenParts] = authorizationHeader.trim().split(/\s+/);

  if (!scheme || scheme.toLowerCase() !== BEARER_SCHEME) {
    return null;
  }

  const token = tokenParts.join(' ').trim();

  return token.length > 0 ? token : null;
}
