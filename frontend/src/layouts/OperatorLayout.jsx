import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScanLine, History, UserRound, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useAdminLogout } from '@/features/admin/hooks/useAdminAuth';

// Completely independent from AdminLayout: no sidebar, no admin nav items
// (Events/Registrations/QR Codes/Analytics never appear here), just a thin
// top bar and a large-target bottom nav — built for a gate operator working
// quickly on a tablet or phone, not an admin at a desk.
const NAV_ITEMS = [
  { to: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/operator/verify', label: 'Verify', icon: ScanLine },
  { to: '/operator/history', label: 'History', icon: History },
  { to: '/operator/profile', label: 'Profile', icon: UserRound },
];

export const OperatorLayout = ({ children }) => {
  const navigate = useNavigate();
  const admin = useAdminAuthStore((state) => state.admin);
  const logoutMutation = useAdminLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/operator/login');
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="glass-panel sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <ScanLine className="size-4" />
          </span>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">Operator Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{admin?.name}</span>
          <Button variant="ghost" size="icon-sm" onClick={handleLogout} aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-24">{children}</main>

      <nav className="glass-panel fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-white/10">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <Icon className="size-6" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default OperatorLayout;
