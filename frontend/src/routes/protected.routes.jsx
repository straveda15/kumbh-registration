import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

// Admin and Operator are separate, independent guards (different redirect
// targets) even though — by backend design — they currently check the same
// session store. The backend has only one privileged account type
// (admin/superadmin, see backend/src/constants/roles.js); there is no
// distinct operator identity server-side, so an operator login and an
// admin login are the same credential. Splitting the guard by section here
// keeps the two route trees fully independent at the routing/redirect
// level without inventing a backend capability that doesn't exist.

export const AdminProtectedRoute = ({ children }) => {
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export const OperatorProtectedRoute = ({ children }) => {
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/operator/login" replace state={{ from: location }} />;
  }

  return children;
};

// A citizen session means EITHER an anonymous draft token (fresh off the
// wizard) or a logged-in pilgrim account token (from /login) — see
// useHasCitizenSession. Unauthenticated visitors to a pilgrim-data page
// always land on /login, same pattern as Admin/Operator above.
export const PilgrimProtectedRoute = ({ children }) => {
  const hasSession = useHasCitizenSession();
  const location = useLocation();

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const protectedRoutes = { AdminProtectedRoute, OperatorProtectedRoute, PilgrimProtectedRoute };

export default protectedRoutes;
