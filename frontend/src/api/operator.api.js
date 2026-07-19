import { adminApiClient } from './adminApiClient';

export const verifyPass = (code) => adminApiClient.post('/operator/verify', { code });

export const logScan = ({ digitalPassId, result, reason }) =>
  adminApiClient.post('/operator/scan-log', { digitalPassId, result, reason });

export const listScanHistory = (params) => adminApiClient.get('/operator/scan-history', { params });

export const getOperatorDashboard = () => adminApiClient.get('/operator/dashboard');

export default { verifyPass, logScan, listScanHistory, getOperatorDashboard };
