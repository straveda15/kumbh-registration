import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  QrCode,
  CheckCircle2,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminUiStore } from '@/store/useAdminUiStore';

// Admin-only nav — Operator's Dashboard/Verify/History never appear here
// (and vice versa in OperatorLayout), so the two sections stay completely
// independent rather than sharing one combined sidebar.
const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/registrations', label: 'Registrations', icon: Users },
  { to: '/admin/approvals', label: 'Approvals', icon: CheckCircle2 },
  { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
  { to: '/admin/operators', label: 'Operators', icon: UserCog },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
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
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
            isActive
              ? 'bg-primary/15 text-foreground ring-1 ring-primary/40'
              : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
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
    <aside
      className={cn(
        'glass-panel sticky top-0 hidden h-screen shrink-0 flex-col gap-1 rounded-none border-r border-white/10 p-3 transition-all md:flex',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn('flex items-center gap-2 px-2 py-3', isCollapsed && 'justify-center')}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-semibold text-primary">
          K
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
