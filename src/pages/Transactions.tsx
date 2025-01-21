import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CategorizedTransactionsContainer from "@/components/categorized-transactions/CategorizedTransactionsContainer";

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If we have state from the previous route, use it
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      // Default to dashboard if no previous route
      navigate('/');
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
        <div className="w-[100px]" />
      </div>

      <CategorizedTransactionsContainer />
    </div>
  );
};

export default Transactions;