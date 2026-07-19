import { verifyDraftToken, verifyPilgrimToken } from '../helpers/token.helper.js';
import { Registration } from '../models/registration.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Verifies the citizen's registration session — this only proves "the
// token belongs to a real registration" — it does NOT gate on
// registrationStatus. Editability (draft-only) is enforced independently
// at the service layer by assertDraftEditable on every mutating function,
// so read routes (e.g. getDraft) keep working after submission, which is
// what lets the same token power both the wizard and the citizen dashboard.
//
// Accepts EITHER of two token types, tried in order:
//  1. A draft token (signed at /registration/start) — anonymous, tied to
//     exactly one registration, used throughout the wizard before an
//     account exists.
//  2. A pilgrim token (signed at /pilgrim/login) — a real logged-in
//     account. Resolved to that account's most recent registration (one
//     account = one registration in this demo), then treated identically
//     from here on — every existing controller/service on this token
//     (getDraft, step saves, documents, notifications, submit, ...) works
//     unchanged for a logged-in pilgrim with zero code of its own.
export const verifyDraftAccess = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw ApiError.unauthorized('Draft access token missing');
  }

  let decoded;
  let isPilgrimToken = false;
  try {
    decoded = verifyDraftToken(token);
  } catch (draftErr) {
    try {
      decoded = verifyPilgrimToken(token);
      isPilgrimToken = true;
    } catch (pilgrimErr) {
      throw ApiError.unauthorized('Invalid or expired session');
    }
  }

  if (isPilgrimToken) {
    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Account no longer active');
    }

    const registration = await Registration.findOne({ userId: user._id }).sort({ createdAt: -1 });
    if (!registration) {
      throw ApiError.notFound('No registration found for this account');
    }

    req.draft = {
      registration,
      userId: user._id.toString(),
      eventId: registration.eventId.toString(),
    };
    return next();
  }

  const registration = await Registration.findById(decoded.registrationId);

  if (!registration) {
    throw ApiError.unauthorized('Registration draft no longer exists');
  }

  if (registration.userId.toString() !== decoded.userId) {
    throw ApiError.unauthorized('Draft token does not match this registration');
  }

  req.draft = {
    registration,
    userId: decoded.userId,
    eventId: decoded.eventId,
  };

  next();
});

export default verifyDraftAccess;
