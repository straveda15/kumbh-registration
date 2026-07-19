import { adminApiClient } from './adminApiClient';

// getOverview/getRecentActivity wrap their payload in a named key inside
// the standard envelope (`{ overview }` / `{ activity }`, see
// backend/src/controllers/admin.controller.js) — adminApiClient's
// interceptor only unwraps the outer envelope, so unwrap the named key
// here too. getTrend is spread flat by the backend already (no wrapper),
// so it needs no change.
export const getOverview = () => adminApiClient.get('/admin/analytics').then((res) => res.overview);

export const getTrend = (days = 30) => adminApiClient.get('/admin/analytics/trend', { params: { days } });

export const getRecentActivity = (limit = 20) =>
  adminApiClient.get('/admin/analytics/activity', { params: { limit } }).then((res) => res.activity);

export default { getOverview, getTrend, getRecentActivity };
