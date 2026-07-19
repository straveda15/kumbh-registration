import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCard } from './SummaryCard';
import { NotificationRow } from './NotificationRow';

export const NotificationsCard = ({ notifications, isLoading }) => {
  const unreadCount = notifications?.filter((item) => item.status === 'unread').length ?? 0;

  return (
    <SummaryCard
      title="Notifications"
      icon={Bell}
      action={unreadCount > 0 ? <Badge>{unreadCount} new</Badge> : null}
    >
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ) : notifications?.length ? (
        <ul className="flex flex-col gap-3">
          {notifications.slice(0, 6).map((item) => (
            <NotificationRow key={item._id} notification={item} />
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No notifications yet.</p>
      )}
      <Button asChild variant="ghost" size="sm" className="w-fit gap-1.5 text-primary">
        <Link to="/notifications">
          View all <ArrowRight className="size-3.5" />
        </Link>
      </Button>
    </SummaryCard>
  );
};

export default NotificationsCard;
