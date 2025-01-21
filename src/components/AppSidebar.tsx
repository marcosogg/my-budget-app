import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { Link, useLocation } from "react-router-dom";
import { Home, FileUp, RefreshCcw, Bell, Settings, LogOut } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();

  const isRouteActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-6">
          <h2 className="text-lg font-semibold">Finance Tracker</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex items-center justify-end p-4">
          <NotificationBell />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/')}>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild variant="secondary" isActive={isRouteActive('/upload')}>
              <Link to="/upload" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Upload CSV
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/transactions')}>
              <Link to="/transactions" className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" />
                Transactions
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/reminders')}>
              <Link to="/reminders" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Reminders
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <SettingsDropdown />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isRouteActive('/login')}>
            <Link to="/login" className="flex items-center gap-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Logout
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}