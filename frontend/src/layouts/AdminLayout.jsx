import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { cn } from '@/lib/utils';
import { useAdminUiStore } from '@/store/useAdminUiStore';

// Matches the existing layout convention (WizardLayout/AppLayout both take
// `children` rather than relying on nested <Outlet /> routing, since
// AppRouter.jsx is a flat route list).
export const AdminLayout = ({ children }) => {
  const isCollapsed = useAdminUiStore((state) => state.isSidebarCollapsed);

  return (
    <div className="min-h-screen w-full">
      <AdminSidebar />
      {/* Margin-left matches AdminSidebar's own fixed width exactly (16/64
          Tailwind spacing units = the sidebar's w-16/w-64) so content
          starts right where the sidebar ends — below `md` the sidebar is
          hidden entirely (mobile uses the Sheet drawer instead), so no
          offset there.
          min-w-0: without it, a flex item defaults to min-width: auto, so
          it can't shrink below AdminTopbar's sticky-header content's
          natural width — on narrow viewports that forced this column (and
          the header/main inside it) a few pixels wider than the actual
          viewport, causing a hairline horizontal scrollbar.
          overflow-x-hidden on <main> is the same guarantee applied to page
          content itself. */}
      <div
        className={cn(
          'flex min-h-screen min-w-0 flex-col transition-[margin-left] duration-200',
          isCollapsed ? 'md:ml-16' : 'md:ml-64'
        )}
      >
        <AdminTopbar />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
