import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { StatsCard } from "./StatsCard";
import { StatsGrid } from "./StatsGrid";
import { TransactionStats } from "@/types/transaction";

interface StatsHeaderProps {
  stats: TransactionStats;
  isLoading?: boolean;
}

const StatsHeader = ({ 
  stats,
  isLoading = false
}: StatsHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewAll = () => {
    navigate('/transactions', { 
      state: { from: location.pathname }
    });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Transaction Stats</h2>
      <Button variant="outline" onClick={handleViewAll}>
        View All
      </Button>
    </div>
  );
};

export default StatsHeader;