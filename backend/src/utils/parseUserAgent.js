// Coarse User-Agent heuristics for an internal audit trail (scan logs) —
// not aiming for perfect device/browser detection, just something more
// readable than dumping the raw header on every row.
const DEVICE_PATTERNS = [
  { pattern: /iPad|Tablet/i, label: 'Tablet' },
  { pattern: /Mobile|iPhone|Android/i, label: 'Mobile' },
];

const BROWSER_PATTERNS = [
  { pattern: /Edg\//i, label: 'Edge' },
  { pattern: /Chrome\//i, label: 'Chrome' },
  { pattern: /Firefox\//i, label: 'Firefox' },
  { pattern: /Safari\//i, label: 'Safari' },
];

export const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return { device: null, browser: null };
  }

  const device = DEVICE_PATTERNS.find(({ pattern }) => pattern.test(userAgent))?.label || 'Desktop';
  const browser = BROWSER_PATTERNS.find(({ pattern }) => pattern.test(userAgent))?.label || 'Unknown';

  return { device, browser };
};

export default parseUserAgent;
