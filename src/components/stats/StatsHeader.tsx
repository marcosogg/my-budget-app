import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon } from "lucide-react";

interface StatsHeaderProps {
  firstTransactionDate: Date | null;
  lastTransactionDate: Date | null;
  isLoading?: boolean;
}

export const StatsHeader = ({ 
  firstTransactionDate,
  lastTransactionDate,
  isLoading = false 
}: StatsHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewAll = () => {
    navigate('/transactions', { 
      state: { from: location.pathname }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-7 w-[300px]" />
        <Skeleton className="h-5 w-[200px]" />
      </div>
    );
  }

  if (!firstTransactionDate || !lastTransactionDate) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Transaction Overview</h2>
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(firstTransactionDate, 'MMMM d, yyyy')} - {format(lastTransactionDate, 'MMMM d, yyyy')}
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={handleViewAll} size="sm">
        View All
      </Button>
    </div>
  );
};