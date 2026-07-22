import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  QrCode,
  Menu,
  HelpCircle,
  LayoutDashboard,
  ClipboardList,
  IdCard,
  UserRound,
  LogOut,
  FolderOpen,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';
import { useRegistrationSnapshot } from '@/features/registration-wizard/hooks/useRegistrationSnapshot';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';
import { getRegistrationReturnPath } from '@/utils/registrationReturnPath';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/registration', label: 'My Registration', icon: ClipboardList },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/pass', label: 'Entry Pass', icon: IdCard },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
];

// The ONE navigation surface for the whole citizen portal — a left
// collapsible drawer, opened from the hamburger button at every breakpoint
// (not just mobile). One consistent nav pattern everywhere is simpler than
// a desktop top-nav plus a separate mobile drawer duplicating the same
// links, and matches this redesign's "navigation should be simple" goal.
export const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const hasSession = useHasCitizenSession();
  const { data: snapshot } = useRegistrationSnapshot();
  const clearDraftSession = useDraftSessionStore((state) => state.clearSession);
  const clearPilgrimSession = usePilgrimAuthStore((state) => state.clearSession);
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fullName = snapshot?.personalInformation?.data?.fullName;

  const handleLogout = () => {
    clearDraftSession();
    clearPilgrimSession();
    setDrawerOpen(false);
    // Never drop a citizen on the landing page: a QR-originated session
    // goes back to its /register/:code, everyone else goes to the login
    // page instead of "/".
    const returnPath = getRegistrationReturnPath();
    navigate(returnPath || '/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="flex items-center gap-2">
          {hasSession && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <QrCode className="size-4" />
            </span>
            <span className="hidden sm:inline">Kumbh Registration</span>
          </Link>
        </div>

        {hasSession ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
              >
                {fullName?.[0]?.toUpperCase() || <UserRound className="size-4" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserRound className="size-4" /> My Profile
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {theme === 'dark' ? <Moon className="size-4" /> : theme === 'system' ? <Laptop className="size-4" /> : <Sun className="size-4" />}
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
                      <Icon className="size-4" /> {label}
                      {theme === value && <Check className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="size-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1">
            <Link
              to="/help"
              className="flex items-center gap-1.5 px-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="size-4" /> <span className="hidden sm:inline">Help</span>
            </Link>
            <ThemeSwitcher className="w-auto" />
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="flex items-center justify-center gap-4 px-4 py-4 text-xs text-muted-foreground print:hidden">
        <Link to="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
        <Link to="/help" className="hover:text-foreground">
          Help
        </Link>
      </footer>

      {hasSession && (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="flex w-72 flex-col bg-background">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <QrCode className="size-4" />
                </span>
                Kumbh Registration
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-3">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground hover:bg-accent'
                    )
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default PublicLayout;
