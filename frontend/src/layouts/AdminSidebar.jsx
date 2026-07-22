import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  QrCode,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminUiStore } from '@/store/useAdminUiStore';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/registrations', label: 'Registrations', icon: Users },
  { to: '/admin/approvals', label: 'Approvals', icon: CheckCircle2 },
  { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/profile', label: 'Profile', icon: UserRound },
];

export const AdminNavList = ({ collapsed = false, onNavigate }) => (
  <nav className="flex flex-1 flex-col gap-1">
    {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-xl border-l-2 border-transparent px-3 py-2.5 text-sm transition-colors',
            isActive
              ? 'border-l-primary bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-white/5',
            collapsed && 'justify-center px-0'
          )
        }
      >
        <Icon className="size-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </NavLink>
    ))}
  </nav>
);

export const AdminSidebar = () => {
  const isCollapsed = useAdminUiStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useAdminUiStore((state) => state.toggleSidebar);

  return (
    // Fixed, not sticky — pins the sidebar to exactly the viewport height
    // at all times, independent of the content column's height or the
    // collapse state, instead of relying on sticky positioning's "stays
    // within its own containing block" behavior (which only stays pinned
    // for as long as its flex-item parent remains taller than the
    // viewport, and can otherwise leave a gap once you scroll past it).
    // AdminLayout.jsx offsets the content column with a matching
    // margin-left so nothing sits underneath it.
    <aside
      className={cn(
        'glass-panel fixed inset-y-0 left-0 z-40 hidden flex-col gap-1 rounded-none border-r border-border shadow-sm p-3 transition-all print:hidden md:flex',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn('flex items-center gap-2 px-2 py-3', isCollapsed && 'justify-center')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ShieldCheck className="size-4.5" aria-hidden="true" />
        </span>
        {!isCollapsed && <span className="text-sm font-semibold text-foreground">Admin Portal</span>}
      </div>

      <AdminNavList collapsed={isCollapsed} />

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="w-full justify-center gap-1.5 text-muted-foreground"
      >
        {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        {!isCollapsed && 'Collapse'}
      </Button>
    </aside>
  );
};

export default AdminSidebar;
