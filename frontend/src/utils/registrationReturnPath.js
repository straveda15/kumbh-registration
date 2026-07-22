// Session-scoped (tab-lifetime) memory of "which /register/:code did this
// citizen arrive from" — used only to send a QR-originated citizen back to
// their registration instead of the landing page on logout. Deliberately
// sessionStorage, not localStorage: it must not outlive the tab, and it
// must never hold auth tokens (those stay in the zustand-persisted stores).
const STORAGE_KEY = 'qr-registration-return-path';

export const setRegistrationReturnPath = (code) => {
  if (!code) return;
  sessionStorage.setItem(STORAGE_KEY, `/register/${code}`);
};

export const getRegistrationReturnPath = () => sessionStorage.getItem(STORAGE_KEY);

export const clearRegistrationReturnPath = () => sessionStorage.removeItem(STORAGE_KEY);
