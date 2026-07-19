import { Route, Navigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { OperatorProtectedRoute } from './protected.routes';
import { OperatorLayout } from '@/layouts/OperatorLayout';
import { OperatorLoginPage } from '@/pages/operator/OperatorLoginPage';
import { OperatorDashboardPage } from '@/pages/operator/OperatorDashboardPage';
import { QrScannerPage } from '@/pages/operator/QrScannerPage';
import { ScanHistoryPage } from '@/pages/operator/ScanHistoryPage';
import { OperatorProfilePage } from '@/pages/operator/OperatorProfilePage';

// Completely independent from Admin: its own guard (OperatorProtectedRoute
// redirects to /operator/login, not /admin/login) and its own layout (no
// admin sidebar, no Events/Registrations/QR Codes/Analytics nav items).
const operatorPage = (Page) => (
  <OperatorProtectedRoute>
    <OperatorLayout>
      <Page />
    </OperatorLayout>
  </OperatorProtectedRoute>
);

export const operatorRoutes = [
  <Route
    key="operator-login"
    path="/operator/login"
    element={<AnimatedPage><OperatorLoginPage /></AnimatedPage>}
  />,
  <Route key="operator-root" path="/operator" element={<Navigate to="/operator/dashboard" replace />} />,
  <Route
    key="operator-dashboard"
    path="/operator/dashboard"
    element={<AnimatedPage>{operatorPage(OperatorDashboardPage)}</AnimatedPage>}
  />,
  <Route
    key="operator-verify"
    path="/operator/verify"
    element={<AnimatedPage>{operatorPage(QrScannerPage)}</AnimatedPage>}
  />,
  <Route
    key="operator-history"
    path="/operator/history"
    element={<AnimatedPage>{operatorPage(ScanHistoryPage)}</AnimatedPage>}
  />,
  <Route
    key="operator-profile"
    path="/operator/profile"
    element={<AnimatedPage>{operatorPage(OperatorProfilePage)}</AnimatedPage>}
  />,
];

export default operatorRoutes;
