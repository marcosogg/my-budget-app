import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UncategorizedAlertProps {
  uniqueDescriptions: number;
  totalTransactions: number;
}

export const UncategorizedAlert = ({ uniqueDescriptions, totalTransactions }: UncategorizedAlertProps) => {
  const navigate = useNavigate();

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Uncategorized Expenses Found</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          You have {uniqueDescriptions} different types of expenses ({totalTransactions} transactions in total) that need to be categorized.
        </p>
        <Button
          variant="outline"
          className="mt-2 bg-destructive/10 hover:bg-destructive/20 border-destructive/50"
          onClick={() => navigate("/categorize")}
        >
          Categorize Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};