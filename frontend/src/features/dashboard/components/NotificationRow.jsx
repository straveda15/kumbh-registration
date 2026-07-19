import { formatDateTime } from '@/utils/formatDate';

// Shared row rendering — used by the compact NotificationsCard (dashboard)
// and the full NotificationCenterPage (with per-row actions).
export const NotificationRow = ({ notification, actions }) => (
  <li className="flex items-start justify-between gap-3 text-xs">
    <div className="flex flex-col gap-0.5">
      <span className="font-medium text-foreground">{notification.title}</span>
      <span className="text-muted-foreground">{notification.message}</span>
      <span className="text-muted-foreground/70">{formatDateTime(notification.createdAt)}</span>
    </div>
    {actions}
  </li>
);

export default NotificationRow;
