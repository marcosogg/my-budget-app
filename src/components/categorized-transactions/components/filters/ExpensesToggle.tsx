import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ExpensesToggleProps {
  checked: boolean;
  onExpensesOnlyChange: (checked: boolean) => void;
}

export const ExpensesToggle = ({ checked, onExpensesOnlyChange }: ExpensesToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="expenses-only"
        checked={checked}
        onCheckedChange={onExpensesOnlyChange}
      />
      <Label htmlFor="expenses-only">Show Expenses Only</Label>
    </div>
  );
};