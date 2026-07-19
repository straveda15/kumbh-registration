import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });

export const signRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });

export const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret);

// Draft session tokens authorize an anonymous citizen through the
// registration wizard. Signed with their own secret so they can never be
// validated by the admin access/refresh secrets, or vice versa.
export const signDraftToken = (payload) =>
  jwt.sign(payload, config.jwt.draftSecret, { expiresIn: config.jwt.draftExpiresIn });

export const verifyDraftToken = (token) => jwt.verify(token, config.jwt.draftSecret);

// Pilgrim tokens authorize a logged-in citizen account (email+password),
// as opposed to the anonymous per-registration draft token above. Own
// secret for the same reason draft has its own — so a pilgrim token can
// never be mistaken for (or validated as) a draft, admin, or refresh token.
export const signPilgrimToken = (payload) =>
  jwt.sign(payload, config.jwt.pilgrimSecret, { expiresIn: config.jwt.pilgrimExpiresIn });

export const verifyPilgrimToken = (token) => jwt.verify(token, config.jwt.pilgrimSecret);

export default {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  signDraftToken,
  verifyDraftToken,
  signPilgrimToken,
  verifyPilgrimToken,
};
