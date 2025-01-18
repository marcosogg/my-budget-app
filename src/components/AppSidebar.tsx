import { SidebarNav } from "@/components/ui/sidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Link } from "react-router-dom";

export function AppSidebar() {
  return (
    <SidebarNav>
      <div className="flex items-center justify-end p-4">
        <NotificationBell />
      </div>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="p-2 hover:bg-gray-200 rounded">Dashboard</Link>
        <Link to="/transactions" className="p-2 hover:bg-gray-200 rounded">Transactions</Link>
        <Link to="/upload" className="p-2 hover:bg-gray-200 rounded">Upload</Link>
        <Link to="/mappings" className="p-2 hover:bg-gray-200 rounded">Mappings</Link>
        <Link to="/analytics/categories" className="p-2 hover:bg-gray-200 rounded">Categories</Link>
        <Link to="/login" className="p-2 hover:bg-gray-200 rounded">Login</Link>
      </nav>
    </SidebarNav>
  );
}
