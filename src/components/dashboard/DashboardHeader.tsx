import { Button } from "@/components/ui/button";
import { ExternalLink, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Transaction Dashboard</h1>
        <p className="text-muted-foreground">View and manage your financial activity</p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigate('/transactions')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View All
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};