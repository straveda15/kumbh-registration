import { Route, Navigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { AdminProtectedRoute } from './protected.routes';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminRegistrationsPage } from '@/pages/admin/AdminRegistrationsPage';
import { AdminRegistrationDetailPage } from '@/pages/admin/AdminRegistrationDetailPage';
import { AdminApprovalsPage } from '@/pages/admin/AdminApprovalsPage';
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage';
import { AdminEventCreatePage } from '@/pages/admin/AdminEventCreatePage';
import { AdminEventEditPage } from '@/pages/admin/AdminEventEditPage';
import { AdminEventDetailPage } from '@/pages/admin/AdminEventDetailPage';
import { AdminQrCodesPage } from '@/pages/admin/AdminQrCodesPage';
import { AdminOperatorsPage } from '@/pages/admin/AdminOperatorsPage';
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';

// Every Admin route (other than /admin/login itself) is gated by
// AdminProtectedRoute — unauthenticated visitors always land on
// /admin/login (see protected.routes.jsx).
const adminPage = (Page) => (
  <AdminProtectedRoute>
    <AdminLayout>
      <Page />
    </AdminLayout>
  </AdminProtectedRoute>
);

export const adminRoutes = [
  <Route key="admin-login" path="/admin/login" element={<AnimatedPage><AdminLoginPage /></AnimatedPage>} />,
  <Route key="admin-root" path="/admin" element={<Navigate to="/admin/dashboard" replace />} />,
  <Route
    key="admin-dashboard"
    path="/admin/dashboard"
    element={<AnimatedPage>{adminPage(AdminDashboardPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-registrations"
    path="/admin/registrations"
    element={<AnimatedPage>{adminPage(AdminRegistrationsPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-registration-detail"
    path="/admin/registrations/:id"
    element={<AnimatedPage>{adminPage(AdminRegistrationDetailPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-approvals"
    path="/admin/approvals"
    element={<AnimatedPage>{adminPage(AdminApprovalsPage)}</AnimatedPage>}
  />,
  <Route key="admin-events" path="/admin/events" element={<AnimatedPage>{adminPage(AdminEventsPage)}</AnimatedPage>} />,
  <Route
    key="admin-events-new"
    path="/admin/events/new"
    element={<AnimatedPage>{adminPage(AdminEventCreatePage)}</AnimatedPage>}
  />,
  <Route
    key="admin-event-detail"
    path="/admin/events/:id"
    element={<AnimatedPage>{adminPage(AdminEventDetailPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-event-edit"
    path="/admin/events/:id/edit"
    element={<AnimatedPage>{adminPage(AdminEventEditPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-qr-codes"
    path="/admin/qr-codes"
    element={<AnimatedPage>{adminPage(AdminQrCodesPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-operators"
    path="/admin/operators"
    element={<AnimatedPage>{adminPage(AdminOperatorsPage)}</AnimatedPage>}
  />,
  // Analytics reuses the Dashboard component — every analytics widget that
  // exists today (stat cards, trend charts, recent activity) already lives
  // there; there's no separate analytics-only view to duplicate it into.
  <Route
    key="admin-analytics"
    path="/admin/analytics"
    element={<AnimatedPage>{adminPage(AdminDashboardPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-notifications"
    path="/admin/notifications"
    element={<AnimatedPage>{adminPage(AdminNotificationsPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-settings"
    path="/admin/settings"
    element={<AnimatedPage>{adminPage(AdminSettingsPage)}</AnimatedPage>}
  />,
  <Route
    key="admin-profile"
    path="/admin/profile"
    element={<AnimatedPage>{adminPage(AdminProfilePage)}</AnimatedPage>}
  />,
];

export default adminRoutes;
