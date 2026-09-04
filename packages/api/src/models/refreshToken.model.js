import crypto from 'crypto';

import RefreshToken from './refreshToken.mongo.js';

const REFRESH_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14일

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueRefreshToken(userId, clientType) {
  const token = crypto.randomBytes(64).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await RefreshToken.create({ userId, tokenHash, clientType, expiresAt });

  return token;
}

async function rotateRefreshToken(token, clientType) {
  const tokenHash = hashToken(token);

  const existing = await RefreshToken.findOneAndDelete({
    tokenHash,
    clientType,
    expiresAt: { $gt: new Date() },
  });

  if (!existing) {
    return null;
  }

  const refreshToken = await issueRefreshToken(existing.userId, clientType);

  return { userId: existing.userId, refreshToken };
}

async function revokeAllRefreshTokens(userId) {
  await RefreshToken.deleteMany({ userId });
}

export {
  REFRESH_TOKEN_TTL_MS,
  issueRefreshToken,
  rotateRefreshToken,
  revokeAllRefreshTokens,
};
