import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface ReminderHeaderProps {
  onAddNew: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showPaidOnly: boolean;
  onShowPaidChange: (value: boolean) => void;
}

export function ReminderHeader({ 
  onAddNew, 
  searchTerm, 
  onSearchChange,
  showPaidOnly,
  onShowPaidChange,
}: ReminderHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bill Reminders</h1>
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Toggle
          pressed={showPaidOnly}
          onPressedChange={onShowPaidChange}
          className="gap-2"
          aria-label="Toggle paid reminders"
        >
          <span className="text-sm">Show Paid Only</span>
        </Toggle>
      </div>
    </>
  );
}