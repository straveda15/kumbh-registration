import { Navigate } from 'react-router-dom';

// Approvals is a filtered view of the existing Registrations list, not a
// separate feature — reusing the same page/query-string filter (?status=
// submitted) that RegistrationFilters already supports, rather than
// duplicating the registrations table and its approve/reject/suspend
// actions in a second component.
export const AdminApprovalsPage = () => <Navigate to="/admin/registrations?status=submitted" replace />;

export default AdminApprovalsPage;
