import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

export const AdminProtectedRoute = ({ children }) => {
  const accessToken = useAdminAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

// A citizen session means EITHER an anonymous draft token (fresh off the
// wizard) or a logged-in pilgrim account token (from /login) — see
// useHasCitizenSession. Unauthenticated visitors to a pilgrim-data page
// always land on /login, same pattern as Admin above.
export const PilgrimProtectedRoute = ({ children }) => {
  const hasSession = useHasCitizenSession();
  const location = useLocation();

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const protectedRoutes = { AdminProtectedRoute, PilgrimProtectedRoute };

export default protectedRoutes;
