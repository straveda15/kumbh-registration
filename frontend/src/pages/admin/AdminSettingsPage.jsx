import { useTheme } from 'next-themes';
import { Settings, Sun, Moon, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryCard, DataRow } from '@/features/dashboard/components/SummaryCard';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export const AdminSettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const admin = useAdminAuthStore((state) => state.admin);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences for this admin portal session.</p>
      </div>

      <SummaryCard title="Appearance" icon={Settings}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Theme</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark mode.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </Button>
        </div>
      </SummaryCard>

      <SummaryCard title="Account" icon={UserRound}>
        <DataRow label="Name" value={admin?.name} />
        <DataRow label="Email" value={admin?.email} />
        <DataRow label="Role" value={admin?.role} />
      </SummaryCard>
    </div>
  );
};

export default AdminSettingsPage;
