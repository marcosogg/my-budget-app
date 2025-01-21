import { Home, RefreshCcw, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { useAuth } from "@/App";

export function AppSidebar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isRouteActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 min-h-screen border-r bg-background p-4">
      <div className="flex items-center justify-end mb-6">
        <NotificationBell />
      </div>
      <nav className="space-y-2">
        <Button
          variant="ghost"
          asChild
          className={`w-full justify-start ${isRouteActive('/') ? 'bg-accent' : ''}`}
        >
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className={`w-full justify-start ${isRouteActive('/transactions') ? 'bg-accent' : ''}`}
        >
          <Link to="/transactions">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Transactions
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className={`w-full justify-start ${isRouteActive('/analytics/categories') ? 'bg-accent' : ''}`}
        >
          <Link to="/analytics/categories">
            <Bell className="mr-2 h-4 w-4" />
            Categories
          </Link>
        </Button>

        <Button
          variant="ghost"
          asChild
          className={`w-full justify-start ${isRouteActive('/reminders') ? 'bg-accent' : ''}`}
        >
          <Link to="/reminders">
            <Bell className="mr-2 h-4 w-4" />
            Reminders
          </Link>
        </Button>

        <div className="flex items-center px-2">
          <span className="text-sm text-muted-foreground mr-2">Settings</span>
          <SettingsDropdown />
        </div>

        {!isAuthenticated && (
          <Button
            variant="ghost"
            asChild
            className={`w-full justify-start ${isRouteActive('/login') ? 'bg-accent' : ''}`}
          >
            <Link to="/login">
              Login
            </Link>
          </Button>
        )}
      </nav>
    </div>
  );
}