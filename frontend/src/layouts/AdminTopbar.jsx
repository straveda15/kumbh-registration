import { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  Sun,
  Moon,
  LogOut,
  UserRound,
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
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AdminNavList } from './AdminSidebar';
import { AdminSearchCommand } from '@/features/admin/components/AdminSearchCommand';
import { useAdminUiStore } from '@/store/useAdminUiStore';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { useAdminLogout } from '@/features/admin/hooks/useAdminAuth';

const BREADCRUMB_LABELS = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  registrations: 'Registrations',
  approvals: 'Pending Approvals',
  events: 'Events',
  'qr-codes': 'QR Codes',
  analytics: 'Analytics',
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

  const [searchOpen, setSearchOpen] = useState(false);

  const crumbs = buildBreadcrumbs(location.pathname);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/admin/login');
  };

  return (
    <header className="glass-panel topbar-panel sticky top-0 z-30 flex items-center gap-3 border-b border-border px-4 py-3 print:hidden">
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
          size="icon-sm"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="gap-1.5 border-primary/20 bg-accent/50 text-muted-foreground hover:border-primary/40 hover:bg-accent sm:size-auto sm:px-3 sm:py-2 dark:border-input dark:bg-input/30"
        >
          <Search className="size-3.5" /> <span className="hidden sm:inline">Search</span>
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="size-4" /> Logout
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
