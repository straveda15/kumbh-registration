// Local, read-only decode of a JWT's payload claims — no signature
// verification (that's the server's job). Used only to surface claims the
// API response itself doesn't echo back (e.g. eventId), never for trust
// decisions.
export const decodeJwtPayload = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export default decodeJwtPayload;
