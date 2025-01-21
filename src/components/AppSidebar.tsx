import { 
  Sidebar, 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { Link, useLocation } from "react-router-dom";

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
      <SidebarContent>
        <div className="flex items-center justify-end p-4">
          <NotificationBell />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/')}>
              <Link to="/" className="flex items-center gap-2">Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/transactions')}>
              <Link to="/transactions" className="flex items-center gap-2">Transactions</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/upload')}>
              <Link to="/upload" className="flex items-center gap-2">Upload</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/analytics/categories')}>
              <Link to="/analytics/categories" className="flex items-center gap-2">Categories</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/reminders')}>
              <Link to="/reminders" className="flex items-center gap-2">Reminders</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2">
                <SettingsDropdown />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isRouteActive('/login')}>
              <Link to="/login" className="flex items-center gap-2">Login</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}