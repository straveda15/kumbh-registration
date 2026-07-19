import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

// Matches the existing layout convention (WizardLayout/AppLayout both take
// `children` rather than relying on nested <Outlet /> routing, since
// AppRouter.jsx is a flat route list).
export const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen w-full">
    <AdminSidebar />
    <div className="flex min-h-screen flex-1 flex-col">
      <AdminTopbar />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
