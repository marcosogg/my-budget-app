import { Button } from "@/components/ui/button";
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transaction Dashboard</h1>
          <p className="text-sm text-muted-foreground">View and manage your financial activity</p>
        </div>
        <Button onClick={() => navigate('/transactions')} className="flex items-center gap-2">
          View All Transactions
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};