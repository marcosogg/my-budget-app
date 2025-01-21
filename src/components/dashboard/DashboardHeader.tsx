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
        <h1 className="text-4xl font-bold mb-2">Transaction Dashboard</h1>
        <p className="text-gray-600">View your transaction statistics</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/transactions')}>
          View All Transactions
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};