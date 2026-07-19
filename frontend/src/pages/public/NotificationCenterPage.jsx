import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCheck, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationRow } from '@/features/dashboard/components/NotificationRow';
import { useNotifications } from '@/features/dashboard/hooks/useNotifications';
import { useUpdateNotificationStatus } from '@/features/dashboard/hooks/useUpdateNotificationStatus';
import { useHasCitizenSession } from '@/hooks/useHasCitizenSession';

const TABS = [
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'archived', label: 'Archived' },
];

const NotificationList = ({ notifications, onMarkRead, onArchive }) => {
  if (!notifications?.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Nothing here.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {notifications.map((notification) => (
        <NotificationRow
          key={notification._id}
          notification={notification}
          actions={
            <div className="flex shrink-0 gap-1">
              {notification.status !== 'read' && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onMarkRead(notification._id)}
                  aria-label="Mark as read"
                >
                  <CheckCheck className="size-3.5" />
                </Button>
              )}
              {notification.status !== 'archived' && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onArchive(notification._id)}
                  aria-label="Archive"
                >
                  <Archive className="size-3.5" />
                </Button>
              )}
            </div>
          }
        />
      ))}
    </ul>
  );
};

export const NotificationCenterPage = () => {
  const hasSession = useHasCitizenSession();
  const { data: notifications, isLoading } = useNotifications();
  const updateStatus = useUpdateNotificationStatus();

  if (!hasSession) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">No registration found in this browser.</p>
        <Button asChild variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const handleMarkRead = (id) => updateStatus.mutate({ id, status: 'read' });
  const handleArchive = (id) => updateStatus.mutate({ id, status: 'archived' });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Bell className="size-4.5" />
        </span>
        <h1 className="text-2xl font-semibold text-foreground">Notification Center</h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Tabs defaultValue="unread">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="mt-4">
              <div className="glass-card rounded-2xl border-none p-5">
                <NotificationList
                  notifications={(notifications || []).filter((item) => item.status === tab.key)}
                  onMarkRead={handleMarkRead}
                  onArchive={handleArchive}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default NotificationCenterPage;
