import { Link } from 'react-router-dom';
import { QrCode, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

// Independent nav for the Pilgrim-facing section — deliberately minimal (a
// slim top bar) since most public pages (Landing, Wizard, Dashboard, ...)
// already own their own centered, full-height layout. This never renders
// anything admin/operator-related — no sidebar, no analytics, no QR
// management — matching the "public users must never see admin nav"
// requirement structurally, not just by omission.
//
// No "Back to Home" here — that button exists only on the three login
// pages (see AuthLayout). Public/authenticated pilgrim pages alike never
// show it; the logo link below already offers a way home.
export const PublicLayout = ({ children }) => {
  const hasDraft = useHasCitizenSession();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <QrCode className="size-4" />
            </span>
            <span className="hidden sm:inline">Kumbh Registration</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          {hasDraft && (
            <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-foreground">
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
          )}
          <Link to="/help" className="flex items-center gap-1.5 hover:text-foreground">
            <HelpCircle className="size-4" /> Help
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="flex items-center justify-center gap-4 px-4 py-4 text-xs text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
        <Link to="/help" className="hover:text-foreground">
          Help
        </Link>
      </footer>
    </div>
  );
};

export default PublicLayout;
