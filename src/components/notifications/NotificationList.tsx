import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="text-sm font-semibold">Notifications</h4>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`flex flex-col gap-1 p-4 text-left hover:bg-muted/50 border-b transition-colors ${
                !notification.read_at ? 'bg-muted/20' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  {notification.notification_title || 'Notification'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.notification_content || 'No content'}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}