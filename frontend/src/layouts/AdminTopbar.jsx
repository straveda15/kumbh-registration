import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCog,
  UserRound,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AdminNavList } from './AdminSidebar';
import { AdminSearchCommand } from '@/features/admin/components/AdminSearchCommand';
import { useAdminUiStore } from '@/store/useAdminUiStore';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useAdminLogout } from '@/features/admin/hooks/useAdminAuth';
import { useAdminRecentActivity } from '@/features/admin/hooks/useAdminAnalytics';
import { getActivityLabel } from '@/utils/activityLabels';
import { formatDateTime } from '@/utils/formatDate';

const BREADCRUMB_LABELS = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  registrations: 'Registrations',
  approvals: 'Approvals',
  events: 'Events',
  'qr-codes': 'QR Codes',
  operators: 'Operators',
  analytics: 'Analytics',
  notifications: 'Notifications',
  settings: 'Settings',
  profile: 'Profile',
};

const buildBreadcrumbs = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  let path = '';
  return segments.map((segment, index) => {
    path += `/${segment}`;
    const isId = index > 0 && segments[index - 1] === 'registrations' && segment !== 'registrations';
    return {
      path,
      label: isId ? 'Details' : BREADCRUMB_LABELS[segment] || segment,
      isLast: index === segments.length - 1,
    };
  });
};

export const AdminTopbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const admin = useAdminAuthStore((state) => state.admin);
  const isMobileDrawerOpen = useAdminUiStore((state) => state.isMobileDrawerOpen);
  const setMobileDrawerOpen = useAdminUiStore((state) => state.setMobileDrawerOpen);
  const logoutMutation = useAdminLogout();
  const { data: recentActivity } = useAdminRecentActivity(8);

  const [searchOpen, setSearchOpen] = useState(false);

  const crumbs = buildBreadcrumbs(location.pathname);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/admin/login');
  };

  return (
    <header className="glass-panel sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 px-4 py-3">
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setMobileDrawerOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>

      <Breadcrumb className="hidden sm:block">
        <BreadcrumbList>
          {crumbs.map((crumb) => (
            // BreadcrumbItem and BreadcrumbSeparator both render an <li> —
            // they must be siblings inside <ol>, never one nested inside
            // the other, or the browser silently closes the outer <li>
            // early and React warns about invalid <li>-in-<li> nesting.
            <Fragment key={crumb.path}>
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!crumb.isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="size-3.5" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchOpen(true)}
          className="gap-1.5 text-muted-foreground"
        >
          <Search className="size-3.5" /> Search
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative" aria-label="Recent activity">
              <Bell className="size-4" />
              {recentActivity?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 flex size-4 items-center justify-center p-0 text-[10px]">
                  {Math.min(recentActivity.length, 9)}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Recent Activity</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActivity?.length ? (
              recentActivity.map((entry) => (
                <div key={entry._id} className="flex flex-col gap-0.5 px-2 py-1.5 text-xs">
                  <span className="text-foreground">{getActivityLabel(entry.action)}</span>
                  <span className="text-muted-foreground">{formatDateTime(entry.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">No recent activity.</p>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/notifications')}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {admin?.name?.[0]?.toUpperCase() || 'A'}
              </span>
              <span className="hidden text-sm sm:inline">{admin?.name || 'Admin'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{admin?.name}</p>
              <p className="text-xs font-normal text-muted-foreground">{admin?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <UserCog className="size-4" /> {admin?.role}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={isMobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-64 bg-background">
          <SheetHeader>
            <SheetTitle>Admin Portal</SheetTitle>
          </SheetHeader>
          <div className="px-3">
            <AdminNavList onNavigate={() => setMobileDrawerOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <AdminSearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default AdminTopbar;
