// Maps the exact state names collected by the frontend's Personal
// Information step (see frontend/src/utils/indianStates.js — the two lists
// must stay in sync) to the 2-letter code embedded in a pilgrim's
// Registration Number (KP{year}{stateCode}{sequence}).
export const STATE_CODES = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  Assam: 'AS',
  Bihar: 'BR',
  Chhattisgarh: 'CG',
  Goa: 'GA',
  Gujarat: 'GJ',
  Haryana: 'HR',
  'Himachal Pradesh': 'HP',
  Jharkhand: 'JH',
  Karnataka: 'KA',
  Kerala: 'KL',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Manipur: 'MN',
  Meghalaya: 'ML',
  Mizoram: 'MZ',
  Nagaland: 'NL',
  Odisha: 'OD',
  Punjab: 'PB',
  Rajasthan: 'RJ',
  Sikkim: 'SK',
  'Tamil Nadu': 'TN',
  Telangana: 'TS',
  Tripura: 'TR',
  'Uttar Pradesh': 'UP',
  Uttarakhand: 'UK',
  'West Bengal': 'WB',
  'Andaman & Nicobar Islands': 'AN',
  Chandigarh: 'CH',
  'Dadra & Nagar Haveli and Daman & Diu': 'DN',
  Delhi: 'DL',
  'Jammu & Kashmir': 'JK',
  Ladakh: 'LA',
  Lakshadweep: 'LD',
  Puducherry: 'PY',
};

// Falls back to this when a state is missing/unrecognized (defensive only
// — the wizard's State field is a required, closed dropdown) rather than
// throwing, matching how config.pilgrimIdRegionCode already defaults to
// 'XX' when unset.
export const DEFAULT_STATE_CODE = 'XX';

export const getStateCode = (stateName) => STATE_CODES[stateName] || DEFAULT_STATE_CODE;

export default STATE_CODES;
