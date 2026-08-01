import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'aadhaar-demo.json');

/**
 * Finds a demo Aadhaar record matching the given 12-digit aadhaar string.
 * @param {string} aadhaar
 * @returns {object|null}
 */
export const findDemoAadhaar = (aadhaar) => {
  if (!aadhaar || typeof aadhaar !== 'string') {
    return null;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const records = JSON.parse(rawData);

  const cleanedAadhaar = aadhaar.trim();
  const match = records.find((rec) => rec.aadhaar === cleanedAadhaar);

  return match || null;
};

export default { findDemoAadhaar };
