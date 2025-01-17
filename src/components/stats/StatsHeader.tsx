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
  if (isLoading) {
    return (
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Loading statistics...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we fetch your transaction data</p>
      </div>
    );
  }

  if (!firstTransactionDate || !lastTransactionDate) {
    return (
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">No transactions found</h2>
        <p className="text-sm text-muted-foreground">Upload some transactions to see your statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">Transaction Statistics</h2>
      <p className="text-sm text-muted-foreground">
        Showing data from {firstTransactionDate.toLocaleDateString()} to {lastTransactionDate.toLocaleDateString()}
      </p>
    </div>
  );
};